import {TsNode} from "./tsnode";
import {TsEdge} from "./tsedge";
import {TsElement} from "./tselement";

export class TsModel {

    private _nodes: Array<TsNode>;
    private _edges: Array<TsEdge>;
    private _deadlocks: Array<TsNode> | undefined;
    private _mortalTransitions: Array<TsEdge> | undefined;
    private _cycleElements: Array<TsElement>;
    private _freeOfDeadlocks: boolean | undefined;
    private _acyclic: boolean | undefined;
    private _alive: boolean | undefined;

    constructor() {
        this._nodes = new Array<TsNode>();
        this._edges = new Array<TsEdge>();
        this._cycleElements = new Array<TsElement>();
    }

    get nodes(): Array<TsNode>{
        return this._nodes;
    }

    get edges(): Array<TsEdge>{
        return this._edges;
    }

    public addNode(aNode: TsNode){
        this._nodes.push(aNode);
    }
    public addEdge(aEdge: TsEdge){
        this._edges.push(aEdge);
    }

    public getNode(id: String): TsNode | undefined {
        // @ts-ignore
        for (const n of this._nodes) {
            if (id === n.id) {
                return n
            }
        }
        return undefined;
    }

    /** Searches for Deadlocks in the Model and sets the associated attributes
     * {@link _deadlocks} and {@link _freeOfDeadlocks}.
     */
    public searchDeadlocksInModel(): void{
        // first clear deadlock array to prevent double values (if already prefilled)
        this._deadlocks = [];
        this._deadlocks = this.searchDeadlocks(this._nodes, this._edges);
        this._freeOfDeadlocks = this._deadlocks === [];
    }

    /**
     * Searches for Deadlocks in a given set of nodes and edges.
     * @param nodeArray given set of nodes
     * @param edgeArray given set of edges
     */
    private searchDeadlocks(nodeArray: Array<TsNode>, edgeArray: Array<TsEdge>): Array<TsNode> {
        let deadlocks = new Array<TsNode>();
        let noDeadlock = new Array<TsNode>();
        edgeArray.forEach(e =>
            noDeadlock.push(e.nodeFrom));
        nodeArray.forEach(n =>
            {if (! noDeadlock.includes(n))
            {deadlocks.push(n)}}
        )
        return deadlocks;
    }

    /**
     * Checks if the model is acyclic and sets the associated attributes
     * {@link _acyclic}, {@link _cycleElements} , {@link _mortalTransitions}
     * and {@link _alive}.
     */
    public searchCyclesInModel(): void{
        //create copies of nodes and edges of the model
        const tempNodes = [...this._nodes];
        const tempEdges = [...this._edges];
        const tempMortalTransitions = [...this._edges];
        // search Deadlocks in the model
        let tempDeadlocks = this.searchDeadlocks(tempNodes, tempEdges);

        while (tempDeadlocks !== []){
            // take one deadlock
            let currentDeadlock = tempDeadlocks.pop();
            //remove all edges from the model whose nodeTo is the current Deadlock
            tempEdges.filter(e =>
                e.nodeTo !== currentDeadlock);
            // remove the current deadlock from the model
            tempNodes.filter(n =>
                n !== currentDeadlock);
            // search Deadlocks in remaining model
            tempDeadlocks = this.searchDeadlocks(tempNodes, tempEdges)
        }
        // if there are no remaining nodes in the model, the graph is acyclic
        this._acyclic = tempNodes === [];
        // all remaining nodes and edges belong to cycles
        tempNodes.forEach(n => this._cycleElements.push(n));
        tempEdges.forEach(e => this._cycleElements.push(e));
        // removed edges belong to a transition that may die
        this._mortalTransitions = tempMortalTransitions.filter(t => !tempEdges.includes(t));
        this._alive = this._mortalTransitions === [];

    }


}
