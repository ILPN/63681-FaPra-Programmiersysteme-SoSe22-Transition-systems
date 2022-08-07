import {SVGElementWithLabel} from "../../diagram/SVGElementWithLabel";
import {TsNode} from "../../diagram/tsnode";

export class LayoutUtils {

    //TODO Sollte nur an einer Stelle im Programm festgelegt sein
    public static DRAWING_AREA_WIDTH_IN_PIXELS: number = window.innerWidth / 1.1;
    //TODO Sollte nur an einer Stelle im Programm festgelegt sein
    public static DRAWING_AREA_HEIGHT_IN_PIXELS: number = 400;

    // Limits the position of nodes to the frame
    private static WIDTH_POSITION_LIMIT: number = LayoutUtils.DRAWING_AREA_WIDTH_IN_PIXELS - SVGElementWithLabel.circleRadius;
    // Limits the position of nodes to the frame
    private static HEIGHT_POSITION_LIMIT: number = LayoutUtils.DRAWING_AREA_HEIGHT_IN_PIXELS - SVGElementWithLabel.circleRadius;

    /**
     * Adjusts the position of the passed node if its actual position would lie outside the drawing-area. The new position
     * is inside the drawing-area next to the nearest vertical or horizontal border.
     * @param node
     */
    public static limitPositionToDrawingArea(node: TsNode){
        // Ist der Knoten-Radius in Pixeln definiert so wie die Zeichenebene?
        let xPos: number = Math.min(Math.max(node.x, SVGElementWithLabel.circleRadius), (LayoutUtils.WIDTH_POSITION_LIMIT));
        let yPos: number = Math.min(Math.max(node.y, SVGElementWithLabel.circleRadius), (LayoutUtils.HEIGHT_POSITION_LIMIT));
        node.setPosition(xPos, yPos);
    }
}
