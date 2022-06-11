import {TsNode} from "./tsnode";
import {TsEdge} from "./tsedge";
import {TsElement} from "./tselement";
import {TsGraphProperties} from "./tsgraphproperties";

export class TsModel {

    private readonly _nodes: Array<TsNode>;
    private readonly _edges: Array<TsEdge>;

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

    public addNode(aNode: TsNode){
        this._nodes.push(aNode);
    }
    public addEdge(aEdge: TsEdge){
        this._edges.push(aEdge);
    }

    public getNode(id: String): TsNode | undefined {
        // @ts-ignore
        return this._nodes.find ( n => (id === n.id));

    }

    /** Searches for Deadlocks in the Model and sets the associated attributes
     * {@link _deadlocks} and {@link _freeOfDeadlocks}.
     */
    public searchDeadlocksInModel(): Array<TsNode>{
        // first clear deadlock array to prevent double values (if already prefilled)
        let deadlocks: TsNode[];
        deadlocks = this.searchDeadlocks(this._nodes, this._edges);
        return deadlocks;
    }

    public isFreeOfDeadlocks(): boolean {
        return this.searchDeadlocksInModel() === [];

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
    public getGraphProperties(): TsGraphProperties {
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
        const acyclic = tempNodes === [];
        // all remaining nodes and edges belong to cycles
        let cycleElements = new Array<TsElement>();
        tempNodes.forEach(n => cycleElements.push(n));
        tempEdges.forEach(e => cycleElements.push(e));
        // removed edges belong to a transition that may die
        const mortalTransitions = tempMortalTransitions.filter(t => !tempEdges.includes(t));
        const alive = mortalTransitions === [];
        const deadlocks = this.searchDeadlocksInModel();
        return new TsGraphProperties(deadlocks,mortalTransitions,cycleElements,this.isFreeOfDeadlocks(),acyclic,alive);
    }
    getSvgElements():Array<SVGElement> {
        const svgEdges = this._edges.map(e => (e.getSvgElement()));
        const svgNodes = this._nodes.map(e => (e.getSvgElement()));
        return svgEdges.concat(svgNodes);
    }
}
