import {TsElement} from "./tselement";
import {TsNode} from "./tsnode";

export class TsEdge extends TsElement {

    private readonly _nodeFrom: TsNode;
    private readonly _nodeTo: TsNode;

    constructor(id: string, from: TsNode, to: TsNode) {
        super(id);
        this._nodeFrom = from;
        this._nodeTo = to;
    }

    get nodeFrom(): TsNode{
        return this._nodeFrom;
    }

    get nodeTo(): TsNode{
        return this._nodeTo;
    }

}
