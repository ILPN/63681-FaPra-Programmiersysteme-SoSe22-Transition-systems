import {SVGElementWithLabel} from "./SVGElementWithLabel";
import {Vector} from "../spring_embedder/models/vector";
import {TsEdge} from "./tsedge";

export class CurvedPathElementWithLabel extends SVGElementWithLabel {

    private edge: TsEdge;
    private _labelElements: SVGElement[];

    constructor(edge: TsEdge) {
        super('path');
        this.edge = edge;
        this._labelElements = [];
        let labels: string[] = edge.getTransitionLabels();
        labels.reverse();
        while (labels.length > 0) {
            this.createLabelElement(`${labels.pop()}`);
        }
        this.setUpMouseEvents();
        this.setUpSVGAttributes();
        this.setUpTextAttributes();
    }

    setUpSVGAttributes(): void {
        this.svgElement.setAttribute('stroke', 'black');
        this.svgElement.setAttribute('stroke-width', '1');
        this.svgElement.setAttribute('marker-end', "url(#arrow)");
        this.svgElement.setAttribute('fill', 'none');
    }

    setUpTextAttributes(): void {
        for (let l of this.labelElements) {
            l.setAttribute("stroke-width", "1");
            l.setAttribute("fill", "black");
            l.setAttribute("font-size", this.fontSize() + "px");
            l.setAttribute("font-family", "Arial, Helvetica, sans-serif");
        }
    }

    private createLabelElement(text: string) {
        if (this.labelElements.length > 0) {
            let separator: string = ", ";
            let labelElement = <SVGElement>document.createElementNS(SVGElementWithLabel.svgNamespace(), 'text');
            labelElement.appendChild(document.createTextNode(separator));
            this._labelElements.push(labelElement);
        }
        let labelElement = <SVGElement>document.createElementNS(SVGElementWithLabel.svgNamespace(), 'text');
        labelElement.appendChild(document.createTextNode(text));
        this._labelElements.push(labelElement);
    }

    public update(): void {
        let pos1 = this.edge.position_from;
        let pos2 = this.edge.position_to;
        let cp = this.edge.getDragpoint();
        //Write into d for Bezier Curve
        let postitionsString = `M ${pos1.x.toString()},${pos1.y.toString()} Q ${cp.x.toString()}
        ,${cp.y.toString()},${pos2.x.toString()},${pos2.y.toString()}`;
        this.svgElement.setAttribute('d', postitionsString);

        // set label-position
        //TODO TRAN-62 Position verbessern
        //Mitte von Controlpunkt und Mitte der Knoten
        let posTxt = Vector.midOf(pos1, pos2)
        posTxt = Vector.midOf(posTxt, cp)
        let index = 1;
        for (let le of this.labelElements) {
            le.setAttribute("x", posTxt.x.toString());
            if (index % 2 !== 0) {
                posTxt.x = posTxt.x + (le.childNodes[0].textContent!.length * this.fontSize() / 2);
                //posTxt.x = posTxt.x + this.posTxtXEvenOffset();
            } else {
                posTxt.x = posTxt.x + this.posTxtXOddOffset();
            }
            index++;
        }
        this.setLabelAttribute("y", posTxt.y.toString());
    }

    private fontSize() {
        return (0.8 * SVGElementWithLabel.circleRadius);
    }

    private posTxtXOddOffset() {
        return 10;
    }

    get labelElements(): SVGElement[] {
        return this._labelElements;
    }

    setLabelAttribute(qualifiedName: string, value: string) {
        for (let l of this.labelElements) {
            l.setAttribute(qualifiedName, value);
        }
    }

    setUpMouseEventsForLabel(): void {
        for (let l of this._labelElements) {
            l.onmousedown = () => {
                this._dragged = true;
            }
        }
    }

}
