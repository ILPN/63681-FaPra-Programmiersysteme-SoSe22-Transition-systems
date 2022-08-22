import {SVGElementWithLabel} from "../../diagram/SVGElementWithLabel";
import {TsNode} from "../../diagram/tsnode";
import {DisplayComponent} from "../../../components/display/display.component";

export class LayoutUtils {

    /**
     * Adjusts the position of the passed node if its actual position would lie outside the drawing-area. The new position
     * is inside the drawing-area next to the nearest vertical or horizontal border.
     * @param node
     */
    public static limitPositionToDrawingArea(node: TsNode){
        // Ist der Knoten-Radius in Pixeln definiert so wie die Zeichenebene?
        let xPos: number = Math.min(Math.max(node.x, SVGElementWithLabel.circleRadius), LayoutUtils.getWidthPositionLimitPx());
        let yPos: number = Math.min(Math.max(node.y, SVGElementWithLabel.circleRadius), LayoutUtils.getHeightPositionLimitPx());
        node.setPosition(xPos, yPos);
    }

    public static getWidthPositionLimitPx(): number {
        return LayoutUtils.getDrawingAreaWidthPx() - SVGElementWithLabel.circleRadius;
    }

    public static getHeightPositionLimitPx(): number {
        return LayoutUtils.getDrawingAreaHeightPx() - SVGElementWithLabel.circleRadius;
    }

    public static getDrawingAreaWidthPx(): number {
        let xSize = document.getElementById(DisplayComponent.DRAWING_AREA_ID)?.clientWidth;
        if(!xSize){
            xSize = DisplayComponent.DRAWING_AREA_WIDTH_PX_FALLBACK_VALUE;
        }
        return xSize;
    }

    public static getDrawingAreaHeightPx(): number {
        let ySize = document.getElementById(DisplayComponent.DRAWING_AREA_ID)?.clientHeight;
        if(!ySize){
            ySize = DisplayComponent.DRAWING_AREA_HEIGHT_PX_FALLBACK_VALUE;
        }
        return ySize;
    }

}
