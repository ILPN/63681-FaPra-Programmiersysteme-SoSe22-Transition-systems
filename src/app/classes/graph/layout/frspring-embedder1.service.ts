import {Injectable} from '@angular/core';
import {DisplayService} from "../../../services/display.service";
import {TsModel} from "../../diagram/tsmodel";
import {RandomGraphCalculator} from "../random-graph-calculator";
import {LinearCooling} from "./cooling/linear-cooling";
import {Vector} from "../../spring_embedder/models/vector";
import {LayoutUtils} from "./layout-utils";

@Injectable({
    providedIn: 'root'
})
/**
 * Renders a graph by the Fruchterman-Reingold-Spring-Embedder-algorithm.
 */
export class FRSpringEmbedder1Service {

    private static OPTIMAL_INIT_NUMBER_OF_ITERATIONS: number = 100;

    // Je kleiner der Wert, desto elastischer ist der Graph beim verschieben von Knoten. Sollte jedoch nicht 1 sein
    private static OPTIMAL_NODE_MOVE_NUMBER_OF_ITERATIONS: number = 10;

    private readonly drawingAreaInPixels: number = LayoutUtils.getDrawingAreaWidthPx()
        * LayoutUtils.getDrawingAreaHeightPx();

    private readonly optimalInitCoolingStartValue: number = LayoutUtils.getDrawingAreaWidthPx() / 50;

    // Je kleiner der Wert, desto elastischer ist der Graph beim verschieben von Knoten
    private readonly optimalNodeMoveCoolingStartValue: number = LayoutUtils.getDrawingAreaWidthPx() / 800;

    private randomGraphCalculator: RandomGraphCalculator = new RandomGraphCalculator;

    private cooling: LinearCooling;

    private _overallNumberOfIterations: number;

    private graph!: TsModel;

    private optimalEdgeLength!: number;

    constructor(private _displayService: DisplayService) {
        this._displayService.model$.subscribe((graph: TsModel) => {
            this.graph = graph;
            const numberOfNodes: number = this.graph.nodes.length;
            this.optimalEdgeLength = 0.5 * Math.sqrt(this.drawingAreaInPixels / numberOfNodes);
        });
        this._overallNumberOfIterations = FRSpringEmbedder1Service.OPTIMAL_INIT_NUMBER_OF_ITERATIONS;
        this.cooling = new LinearCooling(this.optimalInitCoolingStartValue, this._overallNumberOfIterations);
    }

    public initPositions(): void {
        this.randomGraphCalculator.calculateAndSetPositions(this.graph);
    }

    public setInitLayoutProperties(): void {
        this._overallNumberOfIterations = FRSpringEmbedder1Service.OPTIMAL_INIT_NUMBER_OF_ITERATIONS;
        this.cooling.startValue = this.optimalInitCoolingStartValue;
        this.cooling.overallNumberOfIterations = FRSpringEmbedder1Service.OPTIMAL_INIT_NUMBER_OF_ITERATIONS;
    }

    public setNodeMoveLayoutProperties(): void {
        this._overallNumberOfIterations = FRSpringEmbedder1Service.OPTIMAL_NODE_MOVE_NUMBER_OF_ITERATIONS;
        this.cooling.startValue = this.optimalNodeMoveCoolingStartValue;
        this.cooling.overallNumberOfIterations = FRSpringEmbedder1Service.OPTIMAL_NODE_MOVE_NUMBER_OF_ITERATIONS;
    }

    set overallNumberOfIterations(value: number) {
        this._overallNumberOfIterations = value;
        this.cooling.overallNumberOfIterations = value;
    }

    /**
     * Layouts a graph with previously initialized node-positions.
     * @param fixedNodeId Denotes a node whose position should not be adjusted.
     */
    public layoutGraph(fixedNodeId?: string) {
        const nodeIdToDispacementVectorMap = new Map<string, Vector>();
        for (var i = 1; i <= this._overallNumberOfIterations; i++) {
            // foreach v ∈ V do
            for (let actualNode of this.graph.nodes) {
                //v.disp := 0;
                let displacementVector: Vector = new Vector(0, 0);
                // for u ∈ V do
                for (let node of this.graph.nodes) {
                    //if (u 6 = v) then
                    if (actualNode.id !== node.id && actualNode.id !== fixedNodeId) {
                        //∆ ← v.pos − u.pos ;
                        let distanceVector: Vector = Vector.subtract(node.position, actualNode.position);
                        // v.disp ← v.disp + (∆/|∆|) ∗ f r (|∆|)
                        let distanceVectorLength: number = distanceVector.norm();
                        if (distanceVectorLength !== 0) {
                            // Repulsive Function
                            let repulsiveForceFactor: number = Math.pow(this.optimalEdgeLength, 2) / distanceVectorLength;
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
                let attractiveForceFactor: number = Math.pow(distanceVectorLength, 2) / this.optimalEdgeLength;
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
        }
        // Graph zeichnen
        this.graph.updateSVG();
    }

}
