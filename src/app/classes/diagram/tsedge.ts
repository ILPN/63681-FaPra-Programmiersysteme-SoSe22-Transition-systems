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
        this._nodeTo = to;
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
}
