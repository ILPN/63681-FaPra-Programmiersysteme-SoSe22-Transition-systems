import {TsNode} from "./tsnode";
import {TsEdge} from "./tsedge";
import {TsElement} from "./tselement";

export class TsGraphProperties {
    private _deadlocks: Array<TsNode>;
    private _mortalTransitions: Array<TsEdge>;
    private _cycleElements: Array<TsElement>;
    private _freeOfDeadlocks: boolean;
    private _acyclic: boolean;
    private _alive: boolean;

    constructor(deadlocks: Array<TsNode>, mortalTransitions: Array<TsEdge>, cycleElements: Array<TsElement>, freeOfDeadlocks: boolean, acyclic: boolean, alive: boolean) {
        this._deadlocks = deadlocks;
        this._mortalTransitions = mortalTransitions;
        this._cycleElements = cycleElements;
        this._freeOfDeadlocks = freeOfDeadlocks;
        this._acyclic = acyclic;
        this._alive = alive;

    }
}
