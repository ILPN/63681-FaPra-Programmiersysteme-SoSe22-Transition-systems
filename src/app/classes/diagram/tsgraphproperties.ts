import {TsNode} from "./tsnode";
import {TsEdge} from "./tsedge";
import {TsElement} from "./tselement";

export class TsGraphProperties {
    get deadlocks(): Array<TsNode> {
        return this._deadlocks;
    }

    get mortalTransitions(): Array<TsEdge> {
        return this._mortalTransitions;
    }

    get cycleElements(): Array<TsElement> {
        return this._cycleElements;
    }

    get freeOfDeadlocks(): boolean {
        return this._freeOfDeadlocks;
    }

    get acyclic(): boolean {
        return this._acyclic;
    }

    get alive(): boolean {
        return this._alive;
    }
    private readonly _deadlocks: Array<TsNode>;
    private readonly _mortalTransitions: Array<TsEdge>;
    private readonly _cycleElements: Array<TsElement>;
    private readonly _freeOfDeadlocks: boolean;
    private readonly _acyclic: boolean;
    private readonly _alive: boolean;

    constructor(deadlocks: Array<TsNode>, mortalTransitions: Array<TsEdge>, cycleElements: Array<TsElement>, freeOfDeadlocks: boolean, acyclic: boolean, alive: boolean) {
        this._deadlocks = deadlocks;
        this._mortalTransitions = mortalTransitions;
        this._cycleElements = cycleElements;
        this._freeOfDeadlocks = freeOfDeadlocks;
        this._acyclic = acyclic;
        this._alive = alive;

    }


}
