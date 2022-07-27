import {TsElement} from "./tselement";
import {TsEdge} from "./tsedge";
import {Vector} from "../spring_embedder/models/vector";
import {SVGElementWithLabel} from "./SVGElementWithLabel";
import {CircleElementWithLabel} from "./CircleElementWithLabel";


export class TsNode extends TsElement {
    private readonly _connectedEdges: Set<TsEdge>;
    protected _position: Vector;
    protected _id: string;
    protected readonly _label: string;

    constructor(id: string, label: string) {
        super();
        this._id=id;
        this._label = label;
        this._position = new Vector(0, 0);
        this._connectedEdges = new Set<TsEdge>();
        this.initializeSvg();
    }

    private initializeSvg() {
        this.registerSvg(new CircleElementWithLabel(this));
        this.updateSVG();
    }

    public updateSVG() {
        if (this._svgElement instanceof CircleElementWithLabel) {
            this._svgElement.setPosition(this.position.x, this.position.y)
        }
        this._connectedEdges.forEach(e => {
            e.removeDragpoint()
            e.updateSVG()
        })
    }
    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get label(): string {
        return this._label;
    }
    public circleRadius(): number {
        return SVGElementWithLabel.circleRadius;
    }
    getSvgLabelElement(): SVGElement {
        if (this._svgElement instanceof CircleElementWithLabel) {
            return this._svgElement.labelElement;
        }
        return new SVGElement();
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

    public get position(): Vector {
        return this._position;
    }

    public get connectedEdges(): Set<TsEdge> {
        return this._connectedEdges;
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

    makeStartNodeBold() {
        this._svgElement.setAttribute('stroke-width', '3');
    }

    getConnectedEdges() {
        return Array.from(this._connectedEdges);
    }

    public addConnectedEdge(edge: TsEdge): void {
        this._connectedEdges.add(edge);
    }
    public override isNode():Boolean{
        return true;
    }

    public equals(otherNode: TsNode): Boolean {
        return this.id === otherNode.id
            && this.position.equals(otherNode.position);
    }
}
