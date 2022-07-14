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
        for (let l of this.labelElements) {
            l.setAttribute("stroke-width", "1");
            l.setAttribute("fill", "black");
            l.setAttribute("font-size", CircleElementWithLabel.labelFontSize + "px");
            l.setAttribute("textLength", 1.85 * CircleElementWithLabel.circleRadius + "px");
            l.setAttribute("lengthAdjust", "spacingAndGlyphs");
            l.setAttribute("font-family", "Arial, Helvetica, sans-serif");
        }
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
