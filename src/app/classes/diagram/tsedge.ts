import {TsElement} from "./tselement";
import {TsNode} from "./tsnode";

export class TsEdge extends TsElement {

    private _weighting: number;
    private readonly _nodeFrom: TsNode;
    private readonly _nodeTo: TsNode;


    constructor(id: string, label: string, weighting: number, from: TsNode, to: TsNode) {
        super(id, label);
        this._weighting = weighting;
        this._nodeFrom = from;
        from._connectedEdges.add(this);
        this._nodeTo = to;
        to._connectedEdges.add(this);
    }

    get nodeFrom(): TsNode{
        return this._nodeFrom;
    }

    get nodeTo(): TsNode{
        return this._nodeTo;
    }

    get x_from(): number {
        return this._nodeFrom.x;
    }
    get x_to(): number {
        return this._nodeTo.x;
    }
    get y_from(): number {
        return this._nodeFrom.y;
    }
    get y_to(): number {
        return this._nodeTo.y;
    }
    public updateSVG(){
        let x1 = this.x_from;
        let x2 = this.x_to;
        let y1 = this.y_from;
        let y2 = this.y_to;
        //Pfeile beginnen am Kreisrand -> Polarkoordinaten
        const phi = Math.atan2((y2 - y1), (x2 - x1));
        x1 = x1 + this._nodeFrom.circleRadius() * Math.cos(phi);
        x2 = x2 - this._nodeFrom.circleRadius() * Math.cos(phi);
        y1 = y1 + this._nodeFrom.circleRadius() * Math.sin(phi);
        y2 = y2 - this._nodeFrom.circleRadius() * Math.sin(phi);

        this._svgElement?.setAttribute('x1', x1.toString());
        this._svgElement?.setAttribute('x2', x2.toString());
        this._svgElement?.setAttribute('y1', y1.toString());
        this._svgElement?.setAttribute('y2', y2.toString());
    }
}
