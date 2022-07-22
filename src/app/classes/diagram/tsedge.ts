import {TsElement} from "./tselement";
import {TsNode} from "./tsnode";
import {Vector} from "../spring_embedder/models/vector";
import {CurvedPathElementWithLabel} from "./CurvedPathElementWithLabel";
import {TsTransition} from "./tsTransition";

export class TsEdge extends TsElement {


    private readonly _nodeFrom: TsNode;
    private readonly _nodeTo: TsNode;
    protected dragpoint: Vector | undefined;
    private transitions: TsTransition[];

    constructor(labels: TsTransition[] , from: TsNode, to: TsNode) {
        super();
        this._nodeFrom = from;
        this.transitions = labels
        from.addConnectedEdge(this);
        this._nodeTo = to;
        to.addConnectedEdge(this);
        this.initializeSvg();
    }


    get nodeFrom(): TsNode {
        return this._nodeFrom;
    }

    get nodeTo(): TsNode {
        return this._nodeTo;
    }

    get position_from(): Vector {
        return this._nodeFrom.position;
    }

    get position_to(): Vector {
        return this._nodeTo.position;
    }

    public updateSVG() {
        if (this._svgElement instanceof CurvedPathElementWithLabel) {
            this._svgElement.setPosition(this.position_from, this.position_to, this.dragpoint,this.isSelfLoop());
        }
    }

    private initializeSvg(): void {
        this.registerSvg(new CurvedPathElementWithLabel(this.getTransitionLabels(), this));
        this.updateSVG();
    }

    highlightMortalEdge() {
        this._svgElement.svgElement.setAttribute('stroke', 'orange');
    }

    highlightMortalTransition(text: String){
        let transitionsElements: SVGElement[] = this.getSvgLabelElements();
        for (let t of transitionsElements){
            if (t.textContent === text){
                t.setAttribute('fill','orange');
            }
        }
    }

    writeOn(result: string): string {
        result += `${this.nodeFrom.id} ${this.nodeTo.id} `
        result = this.writeTransitionLabelsOn(result,' ');
        result += '\n';
        return result;
    }

    public setDragpoint(position: Vector): void {
        this.dragpoint = position;
        this.updateSVG();
    }

    public addTransition(transition :TsTransition){
        this.transitions.push(transition);
    }

    setPosition(x: number, y: number): void {
        this.setDragpoint(new Vector(x, y));
    }

    /**
     * If this edge is bidirectional then returns the corresponding bidirectional edge, otherwise returns null.
     */
    public getBidirectionalEdge(): TsEdge | null {
        // Untersucht, ob es eine andere Kante gibt, die this._nodeFrom als End- und this._nodeTo als Startknoten hat.
        if(this.isSelfLoop())
            return null;
        let result: TsEdge | null = null;
        for (let edgeOfNodeFrom of this._nodeFrom.connectedEdges) {
            //TODO: Zur Optimierung könnte man noch ausschließen, die aktuelle Kante zu untersuchen.
            // TODO Prüfe auf Objekt-Identität statt auf Id?
            if (edgeOfNodeFrom._nodeTo.id === this._nodeFrom.id && edgeOfNodeFrom._nodeFrom.id === this._nodeTo.id) {
                result = edgeOfNodeFrom;
                break;
            }
        }
        return result;
    }

    isSelfLoop() {
        return this._nodeFrom===this._nodeTo;
    }

    removeDragpoint() {
        this.dragpoint = undefined;
    }

    getTransitionLabels():string[] {
        return this.transitions.map(e => e.label);
    }

    writeTransitionLabelsOn(result: string, separator: string):string {
        this.getTransitionLabels().forEach(label => result += `${label}${separator}`);
        return result;
    }

    getSvgLabelElements():SVGElement[] {
        //ts ignore instead?
        if (this._svgElement instanceof CurvedPathElementWithLabel) {
            return this._svgElement.labelElements;
        }
        return new Array<SVGElement>();
    }
}

