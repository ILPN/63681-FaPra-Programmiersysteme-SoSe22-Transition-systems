import {TsNode} from "./tsnode";
import {TsEdge} from "./tsedge";
import {TsElement} from "./tselement";
import {newArray} from "@angular/compiler/src/util";

export class TsModel {

    private readonly _nodes: Array<TsNode>;
    private readonly _edges: Array<TsEdge>;
    private _deadlocks: Array<TsNode>;
    private _mortalTransitions: Array<TsEdge>;
    private _cycleElements: Array<TsElement>;
    //private _acyclic: boolean;

    constructor() {
        this._nodes = new Array<TsNode>();
        this._edges = new Array<TsEdge>();
        this._deadlocks = new Array<TsNode>();
        this._mortalTransitions = new Array<TsEdge>();
        this._cycleElements = new Array<TsElement>();
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
            {if (id == n.id) {return n}});
        return undefined;
    }

    public searchDeadlocks(): void{
        let noDeadlock = new Array<TsNode>();
        this._edges.forEach(e =>
        noDeadlock.push(e.nodeFrom));
        this._nodes.forEach(n =>
            {if (! noDeadlock.includes(n))
            {this._deadlocks.push(n)}}
        )
    }

    public isAcyclic(): boolean{
        //create copy of nodes and edges of the model
        const tempNodes = [...this._nodes];
        const tempEdges = [...this._edges];
        //while (tempNodes.hasDeadlock())

        return true;

    }


}
