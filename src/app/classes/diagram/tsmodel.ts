import {TsNode} from "./tsnode";
import {TsEdge} from "./tsedge";
import {TsElement} from "./tselement";
import {TsGraphProperties} from "./tsgraphproperties";
import {FRSpringEmbedder} from "../spring_embedder/frspringembedder";
import {SVGElementWithLabel} from "./SVGElementWithLabel";
import {Vector} from "../spring_embedder/models/vector";


export class TsModel {

    private readonly _nodes: Array<TsNode>;
    private readonly _edges: Array<TsEdge>;
    private _startNode!: TsNode;
    private _propertiesHighlighted: boolean;

    constructor() {
        this._nodes = new Array<TsNode>();
        this._edges = new Array<TsEdge>();
        this._propertiesHighlighted = false
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

    set startNode(aNode: TsNode) {
        this._startNode = aNode;
    }

    get startNode(): TsNode {
        return this._startNode
    }

    get propertiesHighlighted(): boolean {
        return this._propertiesHighlighted;
    }

    set propertiesHighlighted(value: boolean) {
        this._propertiesHighlighted = value;
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

        const reachableEdges = this.searchReachableEdgesInModel();
        const nonReachableEdges = this.edges.filter(e => !reachableEdges.includes(e));
        const reachableTransitions = TsModel.getTransitionsFromEdges(reachableEdges);
        const {reachableNodes, nonReachableNodes} = this.searchReachableAndNonReachableNodes(reachableEdges);
        const nonReachableElements = this.collectNonReachableElements(nonReachableNodes, nonReachableEdges);

        // create copies of reachable nodes and edges of the model
        let tempNodes = [...reachableNodes];
        let tempEdges = [...reachableEdges];

        // search Deadlocks in the model
        const deadlocks = TsModel.searchDeadlocks(reachableNodes, reachableEdges);
        const freeOfDeadlocks = (deadlocks.length === 0);

        let mortalEdges: TsEdge[] = [];
        let mortalTransitions: String[] = [];

        // if there is any deadlock in the model, all transitions may die
        if (!freeOfDeadlocks) {
            mortalEdges = [...reachableEdges];
            mortalTransitions = reachableTransitions;
        }

        let tempModel = this.removeNodesWithNoOutGoingEdge(deadlocks, tempEdges, tempNodes);
        tempEdges = tempModel.tempEdges;
        tempNodes = tempModel.tempNodes;

        // if there are no remaining nodes in the model, the graph is acyclic
        const acyclic = (tempNodes === []);

        tempModel = this.removeNodesWithNoInGoingEdge(tempNodes, tempEdges);
        tempEdges = tempModel.tempEdges;

        const cycleElements = TsModel.searchCycleElements(tempEdges);

        if (freeOfDeadlocks) {
            // if not, all transitions already are in mortalTransitions Array (see above)

            // search for non-mortal edges/transitions in remaining edges
            let foreverReachableTransitions: String[] = [];
            let foreverReachableEdgesAndTransitions = TsModel.searchForeverReachableEdgesAndTransitions(tempEdges);
            tempEdges = foreverReachableEdgesAndTransitions.edgeArrayOut;
            foreverReachableTransitions = foreverReachableEdgesAndTransitions.transitionArrayOut;
            if (foreverReachableTransitions.length === 0) {
                foreverReachableTransitions = TsModel.getTransitionsFromEdges(tempEdges)
            }

            mortalTransitions = reachableTransitions.filter(t => !foreverReachableTransitions.includes(t));
            mortalEdges = reachableEdges.filter(t => !tempEdges.includes(t));
        }

        const alive = mortalTransitions === [];
        return new TsGraphProperties(nonReachableElements, deadlocks, mortalEdges, mortalTransitions, cycleElements,
            freeOfDeadlocks, acyclic, alive);
    }

    private static searchCycleElements(tempEdges: TsEdge[]) {
        const cycleElements = new Array<TsElement>();
        for (let e of tempEdges) {
            let arrayWithE: TsEdge[] = [];
            arrayWithE.push(e);
            TsModel.searchEdgesReachableFromDefinedEdges(arrayWithE, tempEdges);
            //
            let isCycle: boolean = TsModel.isCycle(arrayWithE, e)
            if (isCycle) {
                cycleElements.push(e);
                cycleElements.push(e.nodeFrom)
            }
        }
        return cycleElements;
    }

    private removeNodesWithNoInGoingEdge(tempNodes: TsNode[], tempEdges: TsEdge[]) {
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
        return {tempNodes, tempEdges};
    }

    private collectNonReachableElements(nonReachableNodes: TsNode[], nonReachableEdges: TsEdge[]) {
        const nonReachableElements = new Array<TsElement>();
        nonReachableNodes.forEach(n => nonReachableElements.push(n));
        nonReachableEdges.forEach(e => nonReachableElements.push(e));
        return nonReachableElements;
    }

    private searchReachableAndNonReachableNodes(reachableEdges: TsEdge[]) {
        const reachableNodes: TsNode[] = [];
        if (!this.startNode)
            throw new Error('no Start Node defined');
        reachableNodes.push(this.startNode);
        for (let re of reachableEdges) {
            if (!reachableNodes.includes(re.nodeTo)) {
                reachableNodes.push(re.nodeTo)
            }
        }
        const nonReachableNodes = this.nodes.filter(n => !reachableNodes.includes(n));
        return {reachableNodes, nonReachableNodes};
    }

    private removeNodesWithNoOutGoingEdge(knownDeadlocks: TsNode[], tempEdges: TsEdge[], tempNodes: TsNode[]) {
        let tempDeadlocks: TsNode[] = knownDeadlocks;
        let currentDeadlock: TsNode;

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
        return {tempEdges, tempNodes};
    }

    private static getTransitionsFromEdges(edgeArray: TsEdge[]): String[] {
        let transitionArray: String[] = [];
        for (let e of edgeArray) {
            let edgeTransitions: String[];
            edgeTransitions = e.getTransitionLabels();
            for (let t of edgeTransitions) {
                if (!transitionArray.includes(t)) {
                    transitionArray.push(t);
                }
            }
        }
        return transitionArray
    }

    private static searchForeverReachableEdgesAndTransitions(edgeArray: TsEdge[]) {
        // create a counter for cycles without exit
        let noExitCycleCounter: number = 0;
        let edgeArrayOut: TsEdge[] = [];
        let transitionArrayOut: String[] = [];

        let currentCycleWithNoExitEdges: TsEdge[] = [];
        let cyclesWithNoExitEdges: Array<TsEdge[]> = [];

        for (let e of edgeArray) {
            if (!currentCycleWithNoExitEdges.includes(e)) {
                // search all edges that are reachable from e (current start)
                let currentReachableEdges: TsEdge[] = [];
                currentReachableEdges.push(e);
                TsModel.searchEdgesReachableFromDefinedEdges(currentReachableEdges, edgeArray);
                if (currentReachableEdges.length < edgeArray.length) {
                    // check if currentReachableEdges is a cycle
                    let isCycle = this.isCycle(currentReachableEdges, e);
                    if (isCycle) {
                        noExitCycleCounter++;
                        currentCycleWithNoExitEdges = [...currentReachableEdges];
                        cyclesWithNoExitEdges.push(currentCycleWithNoExitEdges);
                    }
                }
            }
        }
        if (noExitCycleCounter === 0) {
            edgeArrayOut = edgeArray;
        } else {
            if (noExitCycleCounter === 1) {
                edgeArrayOut = currentCycleWithNoExitEdges;
            } else {
                transitionArrayOut = TsModel.searchIdenticalTransitions(cyclesWithNoExitEdges);
            }
        }
        return {edgeArrayOut, transitionArrayOut}
    }

    private static searchIdenticalTransitions(cycleArray: Array<TsEdge[]>): String[] {
        let identicalTransitions: String[] = [];
        let cycle1: TsEdge[] = cycleArray.pop()!;
        let cycle1Transitions: String[] = this.getTransitionsFromEdges(cycle1);
        let cycle2: TsEdge[] = cycleArray.pop()!;
        let cycle2Transitions: String[] = this.getTransitionsFromEdges(cycle2);
        for (let t of cycle1Transitions) {
            if ((cycle2Transitions.includes(t))
                && (!identicalTransitions.includes(t))) {
                identicalTransitions.push(t)
            }
        }
        while (cycleArray.length !== 0) {
            let cycleX: TsEdge[] = cycleArray.pop()!;
            let cycleXTransitions: String[] = this.getTransitionsFromEdges(cycleX);
            for (let t of cycleXTransitions) {
                if (!identicalTransitions.includes(t)) {
                    identicalTransitions = identicalTransitions.filter(e => e !== t)
                }
            }
        }
        return identicalTransitions;
    }

    private static isCycle(edgeArray: TsEdge[], startEdge: TsEdge) {
        let isCycle: boolean = false;
        for (let re of edgeArray) {
            if (re.nodeTo === startEdge.nodeFrom) {
                isCycle = true;
            }
        }
        return isCycle;
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
        const svgNodeLabel: SVGElement[] = [];
        for (let n of this.nodes) {
            svgNodeLabel.push(n.getSvgLabelElement());
        }
        const svgEdgeLabel: SVGElement[] = [];
        for (let e of this.edges) {
            for (let ee of e.getSvgLabelElements())
                svgEdgeLabel.push(ee);
        }
        return svgNodeLabel.concat(svgNodes).concat(svgEdges).concat(svgEdgeLabel);
    }

    /**
     * Computes the embedding of the TS using the SpringEmbedder algorithmn.
     */
    public computeEmbedding(useRandomPositions: Boolean): void {
        const embedder = new FRSpringEmbedder(this);
            embedder.cooling = (iteration: number) => 1.0 / (50 * iteration) ;
            embedder.springLength = 180;
            embedder.fromRandomPositions = useRandomPositions;
            embedder.run(1000, 1);
    }

    public layoutBySpringEmbedder(fromRandomPositions: Boolean) {
        this.computeEmbedding(fromRandomPositions);
        this.centerToScreen();
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
        return this._nodes.find(e => e.isDragged) ?? this._edges.find(e => e.isDragged);
    }

    removeAllDragedMarker() {
        for (const each of this._nodes)
            each.isDragged = false;
        for (const each of this._edges)
            each.isDragged = false;
    }

    highlightStartNode() {
        if (this._startNode)
            this.startNode.highlightStartNode()
    }

    hideProperties() {
        for (const each of this._nodes)
            each.hideProperties()
        for (const each of this._edges)
            each.hideProperties()
        this._propertiesHighlighted = false
    }

    makeStartNodeBold() {
        if (this._startNode)
            this.startNode.makeStartNodeBold()
    }

    private centerToScreen() {
        let max_x = Vector.getMaxX(this.nodes.map(e => e.position));
        let min_x = Vector.getMinX(this.nodes.map(e => e.position));
        let max_y = Vector.getMaxY(this.nodes.map(e => e.position));
        let min_y = Vector.getMinY(this.nodes.map(e => e.position));
        let shift_x = ((SVGElementWithLabel.FULL_X - min_x - max_x) / 2);
        let shift_y = ((SVGElementWithLabel.FULL_Y - min_y - max_y) / 2);
        for (let each of this.nodes) {
            each.position = each.position.add(new Vector(shift_x, shift_y));
        }
    }

    highlightProperties(): void {
        const properties = this.getGraphProperties();
        properties.highlightNonReachableElements();
        properties.highlightCycles();
        properties.highlightDeadlocks();
        properties.highlightMortalTransitions();
        this.highlightStartNode();
        this.propertiesHighlighted = true;
    }

    showHideProperties() {
        if (!this.propertiesHighlighted) {
            this.highlightProperties();
        } else {
            this.hideProperties();
        }
    }

    public nodePositionsOK() {
        for (const node of this._nodes) {
            if (node.position == null) {
                return false;
            }
            if (node.position.x == 0 && node.position.y == 0) {
                return false;
            }
        }
        return true;
    }

    getEdges(transitionLabel: string): TsEdge[] {
        let result = [];
        for (let edge of this._edges) {
            let found = edge.getTransitionLabels().find(e => e === transitionLabel);
            if (found)
                result.push(edge);
        }
        return result;
    }
}
