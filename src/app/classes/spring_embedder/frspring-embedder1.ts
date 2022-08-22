import {TsModel} from "../diagram/tsmodel";
import {Vector} from "./models/vector";
import {LayoutUtils} from "../graph/layout/layout-utils";
import {LinearCooling} from "./cooling/linear-cooling";
import {RandomGraphCalculator} from "../graph/random-graph-calculator";

//TODO replaced by SpringEmbedder1Service-class -> remove this class?
export class FRSpringEmbedder1 {

    //TODO Sollte nur an einer Stelle im Programm festgelegt sein
    private static DRAWING_AREA_WIDTH_IN_PIXELS: number = window.innerWidth / 1.1;

    private static DRAWING_AREA_HEIGHT_IN_PIXELS: number = 400;

    private static DRAWING_AREA_IN_PIXELS: number = FRSpringEmbedder1.DRAWING_AREA_WIDTH_IN_PIXELS
        * FRSpringEmbedder1.DRAWING_AREA_HEIGHT_IN_PIXELS;

    private static OPTIMAL_INIT_NUMBER_OF_ITERATIONS: number = 100;

    // Je kleiner der Wert, desto elastischer ist der Graph beim verschieben von Knoten. Sollte jedoch nicht 1 sein
    private static OPTIMAL_NODE_MOVE_NUMBER_OF_ITERATIONS: number = 10;

    private static OPTIMAL_INIT_COOLING_START_VALUE: number = FRSpringEmbedder1.DRAWING_AREA_WIDTH_IN_PIXELS / 50;

    // Je kleiner der Wert, desto elastischer ist der Graph beim verschieben von Knoten
    private static OPTIMAL_NODE_MOVE_COOLING_START_VALUE: number = FRSpringEmbedder1.DRAWING_AREA_WIDTH_IN_PIXELS / 700;

    private randomGraphCalculator: RandomGraphCalculator = new RandomGraphCalculator;

    private readonly graph: TsModel;

    private cooling: LinearCooling;

    private _overallNumberOfIterations: number;

    public constructor(graph: TsModel) {
        this.graph = graph;
        this._overallNumberOfIterations = FRSpringEmbedder1.OPTIMAL_INIT_NUMBER_OF_ITERATIONS;
        this.cooling = new LinearCooling(FRSpringEmbedder1.OPTIMAL_INIT_COOLING_START_VALUE, this._overallNumberOfIterations);
        //TODO set initial positions here? => maybe pass initialization-function as parameter
    }

    public initPositions(): void {
        this.randomGraphCalculator.calculateAndSetPositions(this.graph);
    }

    public setInitLayoutProperties(): void {
        this._overallNumberOfIterations = FRSpringEmbedder1.OPTIMAL_INIT_NUMBER_OF_ITERATIONS;
        this.cooling.startValue = FRSpringEmbedder1.OPTIMAL_INIT_COOLING_START_VALUE;
        this.cooling.overallNumberOfIterations = FRSpringEmbedder1.OPTIMAL_INIT_NUMBER_OF_ITERATIONS;
    }

    public setNodeMoveLayoutProperties(): void {
        this._overallNumberOfIterations = FRSpringEmbedder1.OPTIMAL_NODE_MOVE_NUMBER_OF_ITERATIONS;
        this.cooling.startValue = FRSpringEmbedder1.OPTIMAL_NODE_MOVE_COOLING_START_VALUE;
        this.cooling.overallNumberOfIterations = FRSpringEmbedder1.OPTIMAL_NODE_MOVE_NUMBER_OF_ITERATIONS;
    }

    set overallNumberOfIterations(value: number) {
        this._overallNumberOfIterations = value;
        this.cooling.overallNumberOfIterations = value;
    }

    /**
     * Layouts a graph with previously initialized node-positions.
     * @param fixedNodeId
     */
    public layoutGraph(fixedNodeId?: string) {
        //TODO Make function in model?
        const numberOfNodes: number = this.graph.nodes.length;
        //TODO choose an approprate value
        const optimalEdgeLengthFactor: number = 0.5;
        const optimalEdgeLength: number = optimalEdgeLengthFactor *
            Math.sqrt(FRSpringEmbedder1.DRAWING_AREA_IN_PIXELS / numberOfNodes);
        //TODO Node-Ids müssen eindeutig sein!
        const nodeIdToDispacementVectorMap = new Map<string, Vector>();

        for (var i = 1; i <= this._overallNumberOfIterations; i++) {
            // foreach v ∈ V do
            for (let actualNode of this.graph.nodes) {
                //v.disp := 0;
                let displacementVector: Vector = new Vector(0, 0);
                // for u ∈ V do
                //TODO Use forEach-function?
                // Geht doppelte Iteration über gleiches Objekt?
                for (let node of this.graph.nodes) {
                    //if (u 6 = v) then
                    if (actualNode.id !== node.id && actualNode.id !== fixedNodeId) {
                        //∆ ← v.pos − u.pos ;
                        let distanceVector: Vector = Vector.subtract(node.position, actualNode.position);
                        // v.disp ← v.disp + (∆/|∆|) ∗ f r (|∆|)
                        let distanceVectorLength: number = distanceVector.norm();
                        if (distanceVectorLength !== 0) {
                            // Repulsive Function
                            // TODO Unter Umständen ein Minus-Zeichen vor Repulsive Function (siehe S. 4)
                            let repulsiveForceFactor: number = Math.pow(optimalEdgeLength, 2) / distanceVectorLength;
                            //TODO Prüfe, ob die Veränderung des distanceVector-Objekts ok ist!
                            displacementVector.addToThisVector(distanceVector.divideBy(distanceVectorLength).multiplyWith(repulsiveForceFactor));
                        }
                    }
                }
                // displacementVector speichern
                nodeIdToDispacementVectorMap.set(actualNode.id, displacementVector);
            }
            // foreach e ∈ E do
            for (let edge of this.graph.edges) {
                // ∆ ← e.v.pos − e.u.pos ;
                let distanceVector: Vector = Vector.subtract(edge.position_from, edge.position_to);
                let distanceVectorLength: number = distanceVector.norm();
                //Attractive function: f a (x) = x 2 /k
                let attractiveForceFactor: number = Math.pow(distanceVectorLength, 2) / optimalEdgeLength;
                //TODO Wie den Fall distanceVectorLength === 0 korrekt behandeln?
                let displacementAdjustment: Vector = distanceVectorLength === 0 ? distanceVector :
                    distanceVector.divideBy(distanceVectorLength).multiplyWith(attractiveForceFactor);

                if (edge.nodeFrom.id !== fixedNodeId) {
                    // @ts-ignore Alle Knoten haben einen initialisierten Displacement-Vector
                    let nodeFromDisplacementVector: Vector = nodeIdToDispacementVectorMap.get(edge.nodeFrom.id);
                    // e.u.disp ← e.u.disp + (∆/|∆|) ∗ f a (|∆|);
                    nodeFromDisplacementVector.addToThisVector(displacementAdjustment);
                }
                if (edge.nodeTo.id !== fixedNodeId) {
                    // @ts-ignore Alle Knoten haben einen initialisierten Displacement-Vector
                    let nodeToDisplacementVector: Vector = nodeIdToDispacementVectorMap.get(edge.nodeTo.id);
                    // e.v.disp ← e.v.disp − (∆/|∆|) ∗ f a (|∆|);
                    nodeToDisplacementVector.subtractFromThisVector(displacementAdjustment);
                }
            }
            let coolingValue: number = this.cooling.cool(i);
            //foreach v ∈ V do
            for (let actualNode of this.graph.nodes) {
                // Anpassen der Knoten-Positionen mit Cooling: v.pos ← v.pos + (v.disp/|v.disp|) ∗ min(v.disp, t);
                // @ts-ignore Alle Knoten haben einen initialisierten Displacement-Vector
                let displacementVector: Vector = nodeIdToDispacementVectorMap.get(actualNode.id);
                let displacementVectorLength: number = displacementVector.norm();
                if (displacementVectorLength !== 0 && actualNode.id !== fixedNodeId) {
                    actualNode
                        .position
                        .addToThisVector(displacementVector.divideBy(displacementVectorLength).multiplyWith(Math.min(displacementVectorLength, coolingValue)));
                }
                // Auf Zeichenebene begrenzen:
                LayoutUtils.limitPositionToDrawingArea(actualNode);
            }
            //TODO Nach jeder Iteration zeichnen, damit die Darstellung flüssiger ist?
        }
        // Graph zeichnen
        this.graph.updateSVG();
    }

}
