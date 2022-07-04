import {TsNode} from "./tsnode";
import {TsEdge} from "./tsedge";
import {TsElement} from "./tselement";
import {TsGraphProperties} from "./tsgraphproperties";
import {FRSpringEmbedder} from "../spring_embedder/frspringembedder";

export class TsModel {

    private readonly _nodes: Array<TsNode>;
    private readonly _edges: Array<TsEdge>;
    private _startNode!: TsNode;

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

    set startNode(aNode: TsNode){
        this._startNode = aNode;
    }

    get startNode(): TsNode{
        return this._startNode
    }

    public getNode(id: String): TsNode | undefined {
        // @ts-ignore
        return this._nodes.find(n => (id === n.id));
    }

    /**
     * Searches for Deadlocks in a given set of nodes and edges.
     * @param nodeArray given set of nodes
     * @param edgeArray given set of edges
     */
    private static searchDeadlocks(nodeArray: TsNode[], edgeArray: TsEdge[]): TsNode[] {
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

    /**
     * Searches for nodes with no incoming edge in a given set of nodes and edges.
     * @param nodeArray given set of nodes
     * @param edgeArray given set of edges
     */
    private static searchStartNodes(nodeArray: TsNode[], edgeArray: TsEdge[]): TsNode[] {
        let startNodes: TsNode[];
        startNodes = [];
        let noStartNode: TsNode[];
        noStartNode = [];
        for (let e of edgeArray) {
            noStartNode.push(e.nodeTo);
        }
        for (let e of nodeArray) {
            if (!(noStartNode.includes(e)))
                (startNodes.push(e))
        }
        return startNodes;
    }

    /**
     * Checks if and where the model has deadlocks, cycles and mortal transitions.
     * Returns an instance of {@link TsGraphProperties}.
     */
    public getGraphProperties(): TsGraphProperties {

        // make lists of all reachable and non-reachable edges in the model
        // (starting from startNode)
        const reachableEdges = this.searchReachableEdgesInModel();
        const nonReachableEdges = this.edges.filter(e => !reachableEdges.includes(e));

        // make a list of reachable edge labels (transitions) in the model
        // (starting from startNode)
        const reachableTransitions = TsModel.getTransitionsFromEdges(reachableEdges);

        // make lists of all reachable and non-reachable nodes in the model
        // (starting from startNode)
        const reachableNodes: TsNode[] = [];
        if (!this.startNode)
            throw new Error('no Start Node defined');
        reachableNodes.push(this.startNode);
        for (let re of reachableEdges){
            if (!reachableNodes.includes(re.nodeTo)){
                reachableNodes.push(re.nodeTo)
            }
        }
        const nonReachableNodes = this.nodes.filter(n => !reachableNodes.includes(n));

        // collect all (from start node) non-reachable nodes and edges
        const nonReachableElements = new Array<TsElement>();
        nonReachableNodes.forEach(n => nonReachableElements.push(n));
        nonReachableEdges.forEach(e => nonReachableElements.push(e));

        // create copies of reachable nodes and edges of the model
        let tempNodes = [...reachableNodes];
        let tempEdges = [...reachableEdges];

        // search Deadlocks in the model
        const deadlocks = TsModel.searchDeadlocks(reachableNodes, reachableEdges);
        const freeOfDeadlocks = (deadlocks.length === 0);

        // if there is any deadlock in the model, all transitions may die
        let mortalEdges: TsEdge[] = [];
        let mortalTransitions: String[] = [];

        if (!freeOfDeadlocks) {
            mortalEdges = [...reachableEdges];
            mortalTransitions = reachableTransitions;
        }

        let tempDeadlocks: TsNode[];
        tempDeadlocks = deadlocks;
        let currentDeadlock: TsNode | undefined;

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
        const acyclic = (tempNodes === []);

        let tempStartNodes: TsNode[];
        tempStartNodes = TsModel.searchStartNodes(tempNodes, tempEdges);
        let currentStartNode: TsNode | undefined;

        // loop to stepwise remove nodes with no incoming edge
        while (tempStartNodes.length !== 0) {
            // take one start node
            currentStartNode = tempStartNodes[0];
            //remove all edges from the model whose nodeFrom is currentStartNode
            tempEdges = tempEdges.filter(e =>
                e.nodeFrom !== currentStartNode);
            // remove currentStartNode from the model
            tempNodes = tempNodes.filter(n =>
                n !== currentStartNode);
            // search start nodes in remaining model
            tempStartNodes = TsModel.searchStartNodes(tempNodes, tempEdges);
        }

        // remaining elements belong to a cycle
        const cycleElements = new Array<TsElement>();
        tempNodes.forEach(n => cycleElements.push(n));
        tempEdges.forEach(e => cycleElements.push(e));

        if (freeOfDeadlocks) {
            // if not, all transitions already are in mortalTransitions Array (see above)

            // search for non-mortal edges/transitions in remaining edges
            tempEdges = TsModel.searchForeverReachableEdges(tempEdges);
            const foreverReachableTransitions = TsModel.getTransitionsFromEdges(tempEdges);

            mortalTransitions = reachableTransitions.filter(t => !foreverReachableTransitions.includes(t));
            mortalEdges = reachableEdges.filter(t => !tempEdges.includes(t));
        }

        const alive = mortalTransitions === [];
        return new TsGraphProperties(nonReachableElements, deadlocks, mortalEdges, mortalTransitions, cycleElements,
            freeOfDeadlocks, acyclic, alive);
    }

    private static getTransitionsFromEdges(edgeArray: TsEdge[]): String[] {
        let transitionArray: String[] = [];
        for (let e of edgeArray) {
            let edgeTransitions: String[];
            edgeTransitions = e.getTransitions();
            for (let t of edgeTransitions) {
                if (!transitionArray.includes(t)) {
                    transitionArray.push(t);
                }
            }
        }
        return transitionArray
    }

    private static searchForeverReachableEdges(edgeArray: TsEdge[]):TsEdge[] {
        // create a counter for cycles without exit
        let noExitCycleCounter: number = 0;

        let cycleWithNoExitEdges: TsEdge[] =[];

        for (let e of edgeArray) {
            // search all edges that are reachable from e (current start)
            let currentReachableEdges: TsEdge[] = [];
            currentReachableEdges.push(e);
            TsModel.searchEdgesReachableFromDefinedEdges(currentReachableEdges, edgeArray);
            if (currentReachableEdges.length < edgeArray.length){
                // check if currentReachableEdges is a cycle
                let isCycle: boolean = false;
                for (let re of currentReachableEdges){
                    if (re.nodeTo === e.nodeFrom){
                        isCycle = true;
                    }
                }
                if (isCycle){
                    noExitCycleCounter++;
                    cycleWithNoExitEdges = [...currentReachableEdges];
                }
            }
        }
        if (noExitCycleCounter === 0){
            return edgeArray;
        } else {
            if (noExitCycleCounter === 1){
                return cycleWithNoExitEdges;
            } else {
                return [];
            }
        }
    }

    /**
     * Searches for edges in a given set of edges,
     * that are reachable from a defined edge.
     * @param edgesToStartWith set of edges that might initially contain only 1 defined edge and will be filled within the method
     * @param givenEdges given set of edges
     */
    private static searchEdgesReachableFromDefinedEdges(edgesToStartWith: TsEdge[], givenEdges: TsEdge[]) {
        for (let currentEdge of edgesToStartWith) {
            for (let i of givenEdges) {
                if ((i.nodeFrom === currentEdge.nodeTo) &&
                    (!edgesToStartWith.includes(i))) {
                    edgesToStartWith.push(i);
                }
            }
        }
    }

    getSvgElements(): Array<SVGElement> {
        const svgEdges = this._edges.map(e => (e.getSvgElement()));
        const svgNodes = this._nodes.map(e => (e.getSvgElement()));
        const svgNodeLabel = this._nodes.map(e => (e.getSvgLabelElement()));
        const svgEdgeLabel = this._edges.map(e => (e.getSvgLabelElement()));
        return svgNodeLabel.concat(svgEdges).concat(svgEdgeLabel).concat(svgNodes);
    }

    public layoutBySpringEmbedder() {
        new FRSpringEmbedder(this._nodes, this._edges).run();
        this.updateSVG();
    }

    private updateSVG() {
        for (const node of this._nodes) {
            node.updateSVG();
        }
    }

    /**
     * Searches for edges that are reachable from startNode.
     */
    private searchReachableEdgesInModel(): TsEdge[] {
        let reachableEdges: TsEdge[];
        reachableEdges = [];
        // search all edges whose nodeFrom is the startNode
        for (let e of this.edges) {
            if (e.nodeFrom === this.startNode) {
                reachableEdges.push(e);
            }
        }
        TsModel.searchEdgesReachableFromDefinedEdges(reachableEdges, this.edges);
        return reachableEdges;
        }


    getDraggedElement() {
        return this._nodes.find(e => e.isDragged)?? this._edges.find(e => e.isDragged);
    }

    removeAllDragedMarker() {
        for (const each of this._nodes)
            each.isDragged= false;
        for (const each of this._edges)
            each.isDragged= false;
    }
}
