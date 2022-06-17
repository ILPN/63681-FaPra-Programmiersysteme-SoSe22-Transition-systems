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

    get nodes(): Array<TsNode> {
        return this._nodes;
    }

    get edges(): Array<TsEdge> {
        return this._edges;
    }

    public addNode(aNode: TsNode) {
        this._nodes.push(aNode);
    }

    public addEdge(aEdge: TsEdge) {
        this._edges.push(aEdge);
    }

    public getNode(id: String): TsNode | undefined {
        // @ts-ignore
        return this._nodes.find(n => (id === n.id));
    }

    /** Searches for Deadlocks in the Model and sets the associated attributes
     * {@link _deadlocks} and {@link _freeOfDeadlocks}.
     */
    public searchDeadlocksInModel(): Array<TsNode> {
        // first clear deadlock array to prevent double values (if already prefilled)
        let deadlocks: TsNode[];
        deadlocks = TsModel.searchDeadlocks(this._nodes, this._edges);
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
    private static searchDeadlocks(nodeArray: Array<TsNode>, edgeArray: Array<TsEdge>): Array<TsNode> {
        let deadlocks: TsNode[];
        deadlocks = [];
        let noDeadlock: TsNode[];
        noDeadlock = [];

        for (let e of edgeArray) {
            noDeadlock.push(e.nodeFrom);
        }
        for (let e of nodeArray) {
            if (!(noDeadlock.includes(e))) {
                deadlocks.push(e)
            }
        }
        return deadlocks;
    }

    private static searchStartNode (nodeArray: Array<TsNode>, edgeArray: Array<TsEdge>): TsNode | undefined {
      let startNode: TsNode | undefined;
      let noStartNode: TsNode[];
      noStartNode = [];
      for (let e of edgeArray) {
          noStartNode.push(e.nodeTo);
      }
      for (let e of nodeArray) {
            if (!(noStartNode.includes(e)))
                (startNode = e)
      }
      return startNode;
    }

    /**
     * Checks if the model has deadlocks and mortal transitions and if there are cycles.
     * Returns an instance of {@link TsGraphProperties}.
     */
    public getGraphProperties(): TsGraphProperties {
        //create copies of nodes and edges of the model
        let tempNodes = [...this.nodes];
        let tempEdges = [...this.edges];
        const tempMortalTransitions = [...this.edges];
        // search Deadlocks in the model
        let tempDeadlocks: Array<TsNode>;
        tempDeadlocks = TsModel.searchDeadlocks(tempNodes, tempEdges);
        let currentDeadlock: TsNode | undefined;
        let currentStartNode: TsNode | undefined;
        currentStartNode = TsModel.searchStartNode(tempNodes, tempEdges);

        //loop to stepwise remove nodes with no out coming edge
        while (tempDeadlocks.length !== 0) {
            // take one deadlock
            currentDeadlock = tempDeadlocks[0];
            //remove all edges from the model whose nodeTo is the currentDeadlock
            tempEdges = tempEdges.filter(e =>
                e.nodeTo !== currentDeadlock);
            // remove the currentDeadlock from the model
            tempNodes = tempNodes.filter(n =>
                n !== currentDeadlock);
            // search Deadlocks in remaining model
            tempDeadlocks = TsModel.searchDeadlocks(tempNodes, tempEdges);
        }
        // if there are no remaining nodes in the model, the graph is acyclic
        let acyclic: boolean;
        acyclic = (tempNodes === []);

        // loop to stepwise remove nodes with no incoming edge
        while (currentStartNode !== undefined) {
            //remove all edges from the model whose nodeFrom is currentStartNode
            tempEdges = tempEdges.filter(e =>
                e.nodeFrom !== currentStartNode);
            // remove currentStartNode from the model
            tempNodes = tempNodes.filter(n =>
                n !== currentStartNode);
            // search StartNode in remaining model
            currentStartNode = TsModel.searchStartNode(tempNodes, tempEdges);
        }

        // remaining elements belong to a cycle
        const cycleElements = new Array<TsElement>();
        tempNodes.forEach(n => cycleElements.push(n));
        tempEdges.forEach(e => cycleElements.push(e));

        // toDo: abklären, ob das korrekt ist und gegebenenfalls abändern!
        // removed edges belong to a transition that may die
        const mortalTransitions = tempMortalTransitions.filter(t => !tempEdges.includes(t));

        const alive = mortalTransitions === [];
        const deadlocks = this.searchDeadlocksInModel();
        return new TsGraphProperties(deadlocks, mortalTransitions, cycleElements, this.isFreeOfDeadlocks(), acyclic, alive);
    }

    getSvgElements(): Array<SVGElement> {
        const svgEdges = this._edges.map(e => (e.getSvgElement()));
        const svgNodes = this._nodes.map(e => (e.getSvgElement()));
        const svgNodeLabel = this._nodes.map(e => (e.getSvgLabelElement()));
        const svgEdgeLabel = this._edges.map(e => (e.getSvgLabelElement()));
        //Reihenfolge ist wichtig, damit die Nodes im Vordergrund sind und problemfrei bewegt werden können (TRAN-61)
        //Folgefrage: geht das Bewegen der Nodes vielleicht smarter?
        return svgNodeLabel.concat(svgEdgeLabel).concat(svgEdges).concat(svgNodes);
    }
}
