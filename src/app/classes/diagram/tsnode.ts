import {TsElement} from "./tselement";
import {TsEdge} from "./tsedge";
import {Vector} from "../spring_embedder/models/vector";
import {SVGElementWithLabel} from "./SVGElementWithLabel";
import {CircleElementWithLabel} from "./CircleElementWithLabel";


export class TsNode extends TsElement {
    private readonly _connectedEdges: Set<TsEdge>;
    protected _position: Vector;

    constructor(id: string, label: string) {
        super(id, label);
        this._position = new Vector(0, 0);
        this._connectedEdges = new Set<TsEdge>();
        this.initializeSvg();
    }

    private initializeSvg() {
        this.registerSvg(new CircleElementWithLabel(this._id + ":" + this._label));
        this.updateSVG();
    }

    public updateSVG() {
        if (this._svgElement instanceof CircleElementWithLabel) {
            this._svgElement.setPosition(this.position.x, this.position.y)
        }
        this._connectedEdges.forEach(e => {
            e.updateSVG()
        })
    }

    public circleRadius(): number {
        return SVGElementWithLabel.circleRadius;
    }

    highlightDeadlock() {
        this._svgElement.setAttribute('stroke', 'red');
        this._svgElement.setLabelAttribute('fill', 'red');
    }

    writeOn(result: string): string {
        //result += `${this._id} ${this._label}\n`;
        result += `${this._id} ${this._label} (${this._position.x.toFixed(2)},${this._position.y.toFixed(2)})\n`;
        return result;
    }

    public setPosition(x: number, y: number) {
        this._position.x = x;
        this._position.y = y;
        this.updateSVG();
    }

    set position(newPosition: Vector) {
        //this is not updating the SVG, thus you can´t see the changes
        this._position = newPosition;
    }

    get x(): number {
        return this._position.x;
    }

    get y(): number {
        return this._position.y;
    }

    get position(): Vector {
        return this._position;
    }

    getConnectedEdges() {
        return Array.from(this._connectedEdges);
    }

    addConnectedEdge(edge: TsEdge) {
        this._connectedEdges.add(edge);
    }

    limitPostionToScreen() {
        let x = Math.min(Math.max(SVGElementWithLabel.circleRadius, this.x),
            SVGElementWithLabel.FULL_X - SVGElementWithLabel.circleRadius);
        let y = Math.min(Math.max(SVGElementWithLabel.circleRadius, this.y),
            SVGElementWithLabel.FULL_Y - SVGElementWithLabel.circleRadius);
        this.position = new Vector(x,y);
    }

    highlightStartNode() {
        this._svgElement.setAttribute('stroke', 'yellow');
    }
}
