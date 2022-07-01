import {TsNode} from "./tsnode";
import {TsEdge} from "./tsedge";
import {TsElement} from "./tselement";

export class TsGraphProperties {
    get nonReachableElements(): Array<TsElement>{
        return this._nonReachableElements;
    }

    get deadlocks(): Array<TsNode> {
        return this._deadlocks;
    }

    get mortalEdges(): Array<TsEdge> {
        return this._mortalEdges;
    }

    get mortalTransitions(): Array<String> {
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
    private readonly _nonReachableElements: Array<TsElement>;
    private readonly _deadlocks: Array<TsNode>;
    private readonly _mortalEdges: Array<TsEdge>;
    private readonly _mortalTransitions: Array<String>;
    private readonly _cycleElements: Array<TsElement>;
    private readonly _freeOfDeadlocks: boolean;
    private readonly _acyclic: boolean;
    private readonly _alive: boolean;

    constructor(nonReachableElements: Array<TsElement>,
                deadlocks: Array<TsNode>, mortalEdges: Array<TsEdge>, mortalTransitions: Array<String>,
                cycleElements: Array<TsElement>, freeOfDeadlocks: boolean, acyclic: boolean, alive: boolean) {
        this._nonReachableElements = nonReachableElements;
        this._deadlocks = deadlocks;
        this._mortalEdges = mortalEdges;
        this._mortalTransitions = mortalTransitions;
        this._cycleElements = cycleElements;
        this._freeOfDeadlocks = freeOfDeadlocks;
        this._acyclic = acyclic;
        this._alive = alive;
    }


}
