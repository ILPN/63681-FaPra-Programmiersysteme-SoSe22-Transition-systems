import {TsModel} from "../diagram/tsmodel";
import {Vector} from "./models/vector";
import {LayoutUtils} from "../graph/layout/layout-utils";

export class FRSpringEmbedder1 {

    //TODO Sollte nur an einer Stelle im Programm festgelegt sein
    private static DRAWING_AREA_WIDTH_IN_PIXELS: number = window.innerWidth / 1.1;

    private static DRAWING_AREA_HEIGHT_IN_PIXELS: number = 400;

    private static DRAWING_AREA_IN_PIXELS: number = FRSpringEmbedder1.DRAWING_AREA_WIDTH_IN_PIXELS
        * FRSpringEmbedder1.DRAWING_AREA_HEIGHT_IN_PIXELS;

    //TODO Idealen Wert festlegen
    private static NUMBER_OF_ITERATIONS: number = 50;

    private static COOLING_START_VALUE: number = FRSpringEmbedder1.DRAWING_AREA_WIDTH_IN_PIXELS / 50;

    private graph: TsModel;

    constructor(graph: TsModel) {
        this.graph = graph;
    }

    public layoutGraph(fixedNodeId?: string) {
        //TODO Make function in model?
        const numberOfNodes: number = this.graph.nodes.length;
        //TODO choose an approprate value
        const optimalEdgeLengthFactor: number = 0.5;
        const optimalEdgeLength: number = optimalEdgeLengthFactor *
            Math.sqrt(FRSpringEmbedder1.DRAWING_AREA_IN_PIXELS / numberOfNodes);
        //TODO Node-Ids müssen eindeutig sein!
        const nodeIdToDispacementVectorMap = new Map<string, Vector>();

        for (var i = 1; i <= FRSpringEmbedder1.NUMBER_OF_ITERATIONS; i++) {
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
            let coolingValue: number = this.coolingValue(i);
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
        //TODO Graph zeichnen
    }

    /**
     *  "the temperature could start at an initial value (say one tenth the width of the frame) and decay to 0
     *  in an inverse linear fashion.”
     * @param iteration The number of iteration. Pass number 1 for the first iteration.
     * @private
     */
    private coolingValue(iteration: number): number {
        // The start-value is approximated to COOLING_START_VALUE here
        return FRSpringEmbedder1.COOLING_START_VALUE -
            FRSpringEmbedder1.COOLING_START_VALUE / (FRSpringEmbedder1.NUMBER_OF_ITERATIONS) * iteration;
    }


}
