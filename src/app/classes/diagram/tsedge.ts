import {TsElement} from "./tselement";
import {TsNode} from "./tsnode";
import {Vector} from "../spring_embedder/models/vector";
import {CurvedPathElementWithLabel} from "./CurvedPathElementWithLabel";
import {TsTransition} from "./tsTransition";
import {SVGElementWithLabel} from "./SVGElementWithLabel";
import {CircleElementWithLabel} from "./CircleElementWithLabel";

export class TsEdge extends TsElement {
    private static BIDIRECTIONAL_EDGES_CURVE_RADIUS: number = 25;

    private readonly _nodeFrom: TsNode;
    private readonly _nodeTo: TsNode;
    private _dragpoint: Vector | undefined;
    private _transitions: TsTransition[];

    constructor(transitions: TsTransition[], from: TsNode, to: TsNode) {
        super();
        this._nodeFrom = from;
        this._transitions = transitions
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
        if (this.isSelfLoop()) {
            return this._nodeFrom.position.shiftAlongAngle(SVGElementWithLabel.circleRadius, -Math.PI / 4);
        } else {
            return this._nodeFrom.position.shiftAlongAngle(SVGElementWithLabel.circleRadius,
                this._nodeFrom.position.angle(this._nodeTo.position));
        }
    }

    get position_to(): Vector {
        if (this.isSelfLoop()) {
            return this._nodeTo.position.shiftAlongAngle(SVGElementWithLabel.circleRadius, -3 * Math.PI / 4);
        } else {
            return this._nodeTo.position.shiftAlongAngle(SVGElementWithLabel.circleRadius,
                this._nodeTo.position.angle(this._nodeFrom.position));
        }
    }

    public updateSVG() {
        if (this._svgElement instanceof CurvedPathElementWithLabel) {
            this.updateTransionsPositions();
            this._svgElement.update();
        }
    }

    private initializeSvg(): void {
        this.registerSvg(new CurvedPathElementWithLabel(this));
        this.updateSVG();
    }

    highlightMortalEdge() {
        this._svgElement.svgElement.setAttribute('stroke', 'orange');
    }

    highlightMortalTransition(text: String) {
        let transition = this._transitions.find(e => e.label === text);
        if (transition) {
            if (this._svgElement instanceof CurvedPathElementWithLabel) {
                this._svgElement.getTextElement(transition)?.setAttribute('fill', 'orange');
            }
        }

    }

    writeOn(result: string): string {
        result += `${this.nodeFrom.id} ${this.nodeTo.id} `
        result = this.writeTransitionLabelsOn(result, ' ');
        result += '\n';
        return result;
    }

    public setDragpoint(position: Vector): void {
        this._dragpoint = position;
        this.updateSVG();
    }

    public addTransition(transition: TsTransition) {
        this._transitions.push(transition);
    }

    get transitions(): TsTransition[] {
        return this._transitions;
    }

    //TODO Warum ist die Position des Dragpoints gleich der Position der Kante?
    setPosition(x: number, y: number): void {
        this.setDragpoint(new Vector(x, y));
    }

    //TODO Warum ist die Position des Dragpoints gleich der Position der Kante?
    setPositionAndUpdateView(x: number, y: number): void {
        this.setDragpoint(new Vector(x, y));
    }

    /**
     * If this edge is bidirectional then returns the corresponding bidirectional edge, otherwise returns null.
     */
    public getBidirectionalEdge(): TsEdge | null {
        // Untersucht, ob es eine andere Kante gibt, die this._nodeFrom als End- und this._nodeTo als Startknoten hat.
        if (this.isSelfLoop())
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
        return this._nodeFrom === this._nodeTo;
    }

    removeDragpoint() {
        this._dragpoint = undefined;
        this.updateSVG();
    }

    getTransitionLabels(): string[] {
        return this._transitions.map(e => e.label);
    }

    writeTransitionLabelsOn(result: string, separator: string): string {
        this.getTransitionLabels().forEach(label => result += `${label}${separator}`);
        return result;
    }

    getSvgLabelElements(): SVGElement[] {
        if (this._svgElement instanceof CurvedPathElementWithLabel) {
            return this._svgElement.labelElements;
        }
        return new Array<SVGElement>();
    }

    getDragpoint(): Vector {
        return this._dragpoint ?? this.defaultDragPoint();
    }

    private defaultDragPoint(): Vector {
        if (this.isSelfLoop()) {
            return Vector.midOf(this.position_from, this.position_to).add(this.selfLoopShift());
        } else {
            // Check if edge is bidirectional
            let otherBiDirEdge: TsEdge | null = this.getBidirectionalEdge();
            if (otherBiDirEdge) {
                let shiftVector: Vector = this.bidirectionalEdgeShift();
                // bend bidirectional edges
                return Vector.add(Vector.midOf(this.position_from, this.position_to), shiftVector);
            }
        }
        return Vector.midOf(this.position_from, this.position_to);
    }

    private bidirectionalEdgeShift(): Vector {
        let edge: Vector = Vector.subtract(this.position_from, this.position_to);
        return edge.orthogonalVector(TsEdge.BIDIRECTIONAL_EDGES_CURVE_RADIUS);
    }

    private selfLoopShift() {
        return new Vector(0, -3 * CircleElementWithLabel.circleRadius);
    }

    private updateTransionsPositions() {
        let posTxt = Vector.midOf(this.position_from, this.position_to)
        posTxt = Vector.midOf(posTxt, this.getDragpoint())
        for (let le of this.transitions) {
            le.position = posTxt;
            let commaShift = 0;
            if (!(le === this.transitions[0]))
                commaShift = 1
            posTxt = new Vector(posTxt.x + ((le.label.length + commaShift) * CurvedPathElementWithLabel.fontSize() / 2), posTxt.y);

        }
    }

    getTransitionsPositions(): Vector[] {
        return this._transitions.map(e => e.position);
    }
}

