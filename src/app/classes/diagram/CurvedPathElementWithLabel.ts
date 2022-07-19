import {SVGElementWithLabel} from "./SVGElementWithLabel";
import {Vector} from "../spring_embedder/models/vector";
import {TsEdge} from "./tsedge";

export class CurvedPathElementWithLabel extends SVGElementWithLabel {

    private static BIDIRECTIONAL_EDGES_CURVE_RADIUS: number = 25;

    private edge: TsEdge;

    // Zeigt an, ob eine bidirektionale Kante gebogen angezeigt wird.
    private _bidirectionalCurveCounter: number = 0;

    //TODO Use edge-properties to set label?
    constructor(label: string, edge: TsEdge) {
        super('path', label);
        this.edge = edge;
    }

    setUpSVGAttributes(): void {
        this.svgElement.setAttribute('stroke', 'black');
        this.svgElement.setAttribute('stroke-width', '1');
        this.svgElement.setAttribute('marker-end', "url(#arrow)");
        this.svgElement.setAttribute('fill', 'none');
    }

    setUpTextAttributes(): void {
        this.labelElement.setAttribute("stroke-width", "1");
        this.labelElement.setAttribute("fill", "black");
        this.labelElement.setAttribute("font-size", 0.8 * SVGElementWithLabel.circleRadius + "px");
        this.labelElement.setAttribute("font-family", "Arial, Helvetica, sans-serif");
    }

    setPosition(pos1: Vector, pos2: Vector, controlpoint: Vector | undefined = undefined): void {
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
        let midPosition: Vector = Vector.midOf(pos1, pos2);
        let cp = controlpoint ?? midPosition;
        let postitionsString = `M ${x1.toString()},${y1.toString()} `;
        // Check if edge is bidirectional
        let otherBiDirEdge: TsEdge | null = this.edge.getBidirectionalEdge();
        if (otherBiDirEdge != null) {
            let shiftVector: Vector = this.bidirectionalEdgeShift(pos1, pos2);
            // bend bidirectional edges
            cp = Vector.add(midPosition, shiftVector);
        }
        postitionsString += `Q ${cp.x.toString()},${cp.y.toString()},${x2.toString()},${y2.toString()}`;
        this.svgElement.setAttribute('d', postitionsString);
        // set label-position
        let posTxt = Vector.midOf(pos1, pos2)
        //TODO TRAN-62 Position verbessern
        //Mitte von Controlpunkt und Mitte der Knoten
        posTxt = Vector.midOf(posTxt, cp)
        this.labelElement.setAttribute("x", posTxt.x.toString());
        this.labelElement.setAttribute("y", posTxt.y.toString());
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


    get bidirectionalCurveCounter(): number {
        return this._bidirectionalCurveCounter;
    }
}
