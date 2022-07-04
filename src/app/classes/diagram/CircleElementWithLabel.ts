import {SVGElementWithLabel} from "./SVGElementWithLabel";

export class CircleElementWithLabel extends SVGElementWithLabel {
    private static labelFontSize: number = 0.6 * CircleElementWithLabel.circleRadius;

    constructor(label: string) {
        super('circle', label);
    }

    setUpSVGAttributes(): void {
        this.svgElement.setAttribute('r', CircleElementWithLabel.circleRadius.toString());
        this.svgElement.setAttribute('fill', 'transparent');
        this.svgElement.setAttribute("stroke", "black");
        this.svgElement.setAttribute("stroke-width", "1");
    }

    setUpTextAttributes(): void {
        this.labelElement.setAttribute("stroke-width", "1");
        this.labelElement.setAttribute("fill", "black");
        this.labelElement.setAttribute("font-size", CircleElementWithLabel.labelFontSize + "px");
        this.labelElement.setAttribute("textLength", 1.85 * CircleElementWithLabel.circleRadius + "px");
        this.labelElement.setAttribute("lengthAdjust", "spacingAndGlyphs");
        this.labelElement.setAttribute("font-family", "Arial, Helvetica, sans-serif");
    }

    setPosition(x: number, y: number) {
        this.svgElement.setAttribute('cx', `${x}`);
        this.svgElement.setAttribute('cy', `${y}`);
        // set label-position
        let xTxt = x - 0.9 * CircleElementWithLabel.circleRadius;
        let yTxt = y + 0.3 * CircleElementWithLabel.labelFontSize;
        this.labelElement.setAttribute("x", xTxt.toString());
        this.labelElement.setAttribute("y", yTxt.toString());
    }

}
