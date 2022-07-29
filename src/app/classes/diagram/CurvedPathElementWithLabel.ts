import {SVGElementWithLabel} from "./SVGElementWithLabel";
import {Vector} from "../spring_embedder/models/vector";
import {TsEdge} from "./tsedge";
import {CircleElementWithLabel} from "./CircleElementWithLabel";

export class CurvedPathElementWithLabel extends SVGElementWithLabel {

    private static BIDIRECTIONAL_EDGES_CURVE_RADIUS: number = 25;

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
        if (this.labelElements.length > 0){
            let separator: string = ", ";
            let labelElement = <SVGElement>document.createElementNS(SVGElementWithLabel.svgNamespace(), 'text');
            labelElement.appendChild(document.createTextNode(separator));
            this._labelElements.push(labelElement);
        }
        let labelElement = <SVGElement>document.createElementNS(SVGElementWithLabel.svgNamespace(), 'text');
        labelElement.appendChild(document.createTextNode(text));
        this._labelElements.push(labelElement);
    }

    public setPosition(pos1: Vector, pos2: Vector, controlpoint: Vector | undefined = undefined, isSelfLoop: boolean): void {
        let x1 = pos1.x;
        let x2 = pos2.x;
        let y1 = pos1.y;
        let y2 = pos2.y;
        //Pfeile beginnen am Kreisrand -> Polarkoordinaten
        let phi1: number;
        let phi2: number;
        if (isSelfLoop) {
            phi1 = -Math.PI / 4;
            phi2 = -3 * Math.PI / 4;
        } else {
            phi1 = pos1.angle(pos2);
            phi2 = pos2.angle(pos1)
        }
        x1 = x1 + SVGElementWithLabel.circleRadius * Math.cos(phi1);
        x2 = x2 + SVGElementWithLabel.circleRadius * Math.cos(phi2);
        y1 = y1 + SVGElementWithLabel.circleRadius * Math.sin(phi1);
        y2 = y2 + SVGElementWithLabel.circleRadius * Math.sin(phi2);
        let cp = controlpoint ?? this.defaultDragPoint(pos1, pos2, isSelfLoop);
        let postitionsString = `M ${x1.toString()},${y1.toString()} `;
        // Check if edge is bidirectional
        let otherBiDirEdge: TsEdge | null = this.edge.getBidirectionalEdge();
        if (otherBiDirEdge && !controlpoint) {
            let shiftVector: Vector = this.bidirectionalEdgeShift(pos1, pos2);
            // bend bidirectional edges
            cp = Vector.add(Vector.midOf(pos1, pos2), shiftVector);
        }
        postitionsString += `Q ${cp.x.toString()},${cp.y.toString()},${x2.toString()},${y2.toString()}`;
        this.svgElement.setAttribute('d', postitionsString);

        // set label-position
        //TODO TRAN-62 Position verbessern
        //Mitte von Controlpunkt und Mitte der Knoten
        let posTxt = Vector.midOf(new Vector(x1, y1), new Vector(x2, y2))
        posTxt = Vector.midOf(posTxt, cp)
        let index = 1;
        for (let le of this.labelElements) {
            le.setAttribute("x", posTxt.x.toString());
            if (index%2 !== 0) {
                posTxt.x = posTxt.x + (le.childNodes[0].textContent!.length * this.fontSize()/2);
                //posTxt.x = posTxt.x + this.posTxtXEvenOffset();
            } else {
                posTxt.x = posTxt.x + this.posTxtXOddOffset();
            }
            index++;
        }
        this.setLabelAttribute("y", posTxt.y.toString());
    }

    private fontSize(){
        return (0.8 * SVGElementWithLabel.circleRadius);
    }

    private posTxtXOddOffset() {
        return 10;
    }

    public selfLoopShift() {
        return new Vector(0, -3 * CircleElementWithLabel.circleRadius);
    }

    private defaultDragPoint(pos1: Vector, pos2: Vector, isSelfLoop: boolean) {
        if (isSelfLoop)
            return pos1.add(this.selfLoopShift());
        else
            return Vector.midOf(pos1, pos2);
    }

    get labelElements(): SVGElement[] {
        return this._labelElements;
    }

    setLabelAttribute(qualifiedName: string, value: string) {
        for (let l of this.labelElements) {
            l.setAttribute(qualifiedName, value);
        }
    }

    /**
     * Calculates a shift-point by which bidirectional edges should be curved to not overlap each other.
     * @param pos1 The starting-point of the edge to be curved.
     * @param pos2 The end-point of the edge to be curved.
     */
    private bidirectionalEdgeShift(pos1: Vector, pos2: Vector): Vector {
        let edge: Vector = Vector.subtract(pos1, pos2);
        let radiusAngle = 0.5 * Math.PI - edge.angleToXAxis();
        let dy = CurvedPathElementWithLabel.BIDIRECTIONAL_EDGES_CURVE_RADIUS * Math.sin(radiusAngle);
        let dx = CurvedPathElementWithLabel.BIDIRECTIONAL_EDGES_CURVE_RADIUS * Math.cos(radiusAngle);
        return new Vector(-dx, dy);
    }

    setUpMouseEventsForLabel(): void {
        for (let l of this._labelElements) {
            l.onmousedown = () => {
                this._dragged = true;
            }
        }
    }

}
