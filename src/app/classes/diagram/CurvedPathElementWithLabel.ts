import {SVGElementWithLabel} from "./SVGElementWithLabel";
import {Vector} from "../spring_embedder/models/vector";

export class CurvedPathElementWithLabel extends SVGElementWithLabel {


    constructor(label: string) {
        super('path', label);
    }

    setUpSVGAttributes(): void {
        this.svgElement.setAttribute('stroke', 'black');
        this.svgElement.setAttribute('stroke-width', '1');
        this.svgElement.setAttribute('marker-end', "url(#arrow)");
        this.svgElement.setAttribute('fill','none');
    }

    setUpTextAttributes(): void {
        this.labelElement.setAttribute("stroke-width", "1");
        this.labelElement.setAttribute("fill", "black");
        this.labelElement.setAttribute("font-size", 0.8 * SVGElementWithLabel.circleRadius + "px");
        this.labelElement.setAttribute("font-family","Arial, Helvetica, sans-serif");
    }

    setPosition(pos1:Vector,pos2:Vector,controlpoint:Vector|undefined=undefined): void {
        let x1 = pos1.x;
        let x2 = pos2.x;
        let y1 = pos1.y;
        let y2 = pos2.y;
        //Pfeile beginnen am Kreisrand -> Polarkoordinaten
        const phi = pos1.angle(pos2);
        x1 = x1 + SVGElementWithLabel.circleRadius * Math.cos(phi);
        x2 = x2 - SVGElementWithLabel.circleRadius * Math.cos(phi);
        y1 = y1 + SVGElementWithLabel.circleRadius * Math.sin(phi);
        y2 = y2 - SVGElementWithLabel.circleRadius * Math.sin(phi);
        let cp = controlpoint?? Vector.midOf(pos1,pos2);
        let postitionsString = `M ${x1.toString()},${y1.toString()} `;

        postitionsString += `Q ${cp.x.toString()},${cp.y.toString()},${x2.toString()},${y2.toString()}`;
        this.svgElement.setAttribute('d', postitionsString);

        // set label-position
        let posTxt = Vector.midOf(pos1,pos2)
        //TODO TRAN-62 Position verbessern
        //Mitte von Controlpunkt und Mitte der Knoten
        posTxt = Vector.midOf(posTxt,cp)
        this.labelElement.setAttribute("x", posTxt.x.toString());
        this.labelElement.setAttribute("y", posTxt.y.toString());
    }
}
