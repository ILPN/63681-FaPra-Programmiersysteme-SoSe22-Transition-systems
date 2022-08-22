import {TsModel} from "../diagram/tsmodel";
import {Vector} from "../spring_embedder/models/vector";
import {LayoutUtils} from "./layout/layout-utils";

export class RandomGraphCalculator {

    /**
     * Calculates and sets random-positions for every node of the passed graph. The calculated positions are limited
     * to the drawing-area.
     * @param graph
     */
    public calculateAndSetPositions(graph: TsModel){
        for (const node of graph.nodes) {
            node.position = new Vector(Math.random() * LayoutUtils.getDrawingAreaWidthPx(),
                Math.random() * LayoutUtils.getDrawingAreaHeightPx());
            LayoutUtils.limitPositionToDrawingArea(node);
        }
    }
}
