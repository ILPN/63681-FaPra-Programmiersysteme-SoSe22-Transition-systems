import {SVGElementWithLabel} from "./SVGElementWithLabel";
import {TsNode} from "./tsnode";

export class CircleElementWithLabel extends SVGElementWithLabel {
    private node: TsNode;
    get labelElement(): SVGElement {
        return this._labelElement;
    }
    setUpMouseEventsForLabel(): void {
            this._labelElement.onmousedown = () => {
                this._dragged = true;
            }

    }
    private static labelFontSize: number = 0.6 * CircleElementWithLabel.circleRadius;
    private _labelElement: SVGElement;

    constructor(label: string, node: TsNode) {
        super('circle');
        this._labelElement = <SVGElement>document.createElementNS(SVGElementWithLabel.svgNamespace(), 'text');
        this._labelElement.appendChild(document.createTextNode(label));
        this.node = node;
        this.setUpMouseEvents();
        this.setUpSVGAttributes();
        this.setUpTextAttributes();
    }

    setUpSVGAttributes(): void {
        this.svgElement.setAttribute('r', CircleElementWithLabel.circleRadius.toString());
        this.svgElement.setAttribute('fill', 'transparent');
        this.svgElement.setAttribute("stroke", "black");
        this.svgElement.setAttribute("stroke-width", "1");
    }

    setUpTextAttributes(): void {
        this._labelElement.setAttribute("stroke-width", "1");
        this._labelElement.setAttribute("fill", "black");
        this._labelElement.setAttribute("font-size", CircleElementWithLabel.labelFontSize + "px");
        this._labelElement.setAttribute("textLength", 1.85 * CircleElementWithLabel.circleRadius + "px");
        this._labelElement.setAttribute("lengthAdjust", "spacingAndGlyphs");
        this._labelElement.setAttribute("font-family", "Arial, Helvetica, sans-serif");

    }
    setLabelAttribute(qualifiedName: string, value: string) {
        this._labelElement.setAttribute(qualifiedName, value);
    }
    setPosition(x: number, y: number) {
        this.svgElement.setAttribute('cx', `${x}`);
        this.svgElement.setAttribute('cy', `${y}`);
        // set label-position
        let xTxt = x - 0.9 * CircleElementWithLabel.circleRadius;
        let yTxt = y + 0.3 * CircleElementWithLabel.labelFontSize;
        this.setLabelAttribute("x", xTxt.toString());
        this.setLabelAttribute("y", yTxt.toString());
    }

}
