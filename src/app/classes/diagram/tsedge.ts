import {TsElement} from "./tselement";
import {TsNode} from "./tsnode";
import {Vector} from "../spring_embedder/models/vector";
import {CurvedPathElementWithLabel} from "./CurvedPathElementWithLabel";

export class TsEdge extends TsElement {

    private readonly _weighting: number;
    private readonly _nodeFrom: TsNode;
    private readonly _nodeTo: TsNode;
    protected dragpoint: Vector | undefined;

    constructor(id: string, label: string, weighting: number, from: TsNode, to: TsNode) {
        super(id, label);
        this._weighting = weighting;
        this._nodeFrom = from;
        from.addConnectedEdge(this);
        this._nodeTo = to;
        to.addConnectedEdge(this);
        this.initializeSvg();
    }

    getTransitions(): String[] {
        return this.label.split(",");
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
        this.registerSvg(new CurvedPathElementWithLabel(this._label, this));
        this.updateSVG();
    }

    highlightMortalEdge() {
        this._svgElement.svgElement.setAttribute('stroke', 'orange');
    }

    highlightMortalTransition(text: String){
        let transitionsElements: SVGElement[] = this.getSvgLabelElement();
        for (let t of transitionsElements){
            if (t.textContent === text){
                t.setAttribute('fill','orange');
            }
        }
    }

    writeOn(result: string): string {
        result += `${this.nodeFrom.id} ${this.nodeTo.id} ${this._label}  \n`;
        return result;
    }

    public setDragpoint(position: Vector): void {
        this.dragpoint = position;
        this.updateSVG();
    }

    setPosition(x: number, y: number): void {
        this.setDragpoint(new Vector(x, y));
    }

    /**
     * If this edge is bidirectional then returns the corresponding bidirectional edge, otherwise returns null.
     */
    public getBidirectionalEdge(): TsEdge | null {
        // Untersucht, ob es eine andere Kante gibt, die this._nodeFrom als End- und this._nodeTo als Startknoten hat.
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
}

