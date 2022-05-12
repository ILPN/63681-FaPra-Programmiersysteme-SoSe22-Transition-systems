import {TsNode} from "./tsnode";
import {TsEdge} from "./tsedge";

export class TsModel {

    private _nodes: Array<TsNode>;
    private _edges: Array<TsEdge>;

    constructor() {
        this._nodes = new Array<TsNode>();
        this._edges = new Array<TsEdge>();
    }

    get nodes(): Array<TsNode>{
        return this._nodes;
    }

    get edges(): Array<TsEdge>{
        return this._edges;
    }

    public getNode(id: String): TsNode | undefined {
        // @ts-ignore
        this._nodes.forEach(n =>
            {if (id == n.id()) {return n}});
        return undefined;
    }


}
