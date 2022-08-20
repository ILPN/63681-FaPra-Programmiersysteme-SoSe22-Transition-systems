import {SVGElementWithLabel} from "./SVGElementWithLabel";
import {TsEdge} from "./tsedge";
import {TsTransition} from "./tsTransition";

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
            l.setAttribute("font-size", CurvedPathElementWithLabel.fontSize() + "px");
            l.setAttribute("font-family", "Arial, Helvetica, sans-serif");
        }
    }

    private createLabelElement(text: string) {
        let separator = "";
        if (this.labelElements.length > 0)
            separator = ", ";
        let labelElement = <SVGElement>document.createElementNS(SVGElementWithLabel.svgNamespace(), 'text');
        labelElement.appendChild(document.createTextNode(separator.concat(text)));
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
        let index = 0;
        let positions = this.edge.getTransitionsPositions();
        for (let le of this.labelElements) {
            let pos = positions[index];
            le.setAttribute("x", pos.x.toString());
            le.setAttribute("y", pos.y.toString());
            index++;
        }

    }

    static fontSize() {
        return (0.8 * SVGElementWithLabel.circleRadius);
    }

    getTextElement(transition: TsTransition) {
        return this._labelElements.find(e => e.textContent === transition.label || e.textContent === ', '.concat(transition.label));
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
