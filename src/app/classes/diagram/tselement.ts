import {Vector} from '../spring_embedder/models/vector'

export abstract class TsElement {

    abstract updateSVG(): void;

    protected _position: Vector;
    //Das SVGElement samt Funktionen könnte in eine eigene Klasse die dann Instanzvariable von TSElement ist.
    //Momentan sind Logik und Darstellung etwas verschränkt.
    protected _svgElement!: SVGElement;
    protected _svgLabelElement!: SVGElement;
    protected _svgNamespace: string = 'http://www.w3.org/2000/svg';
    protected _dragged: boolean
    protected _dragShiftX: number;
    protected _dragShiftY: number;
    protected _id: string;
    protected readonly _label: string;

    protected constructor(id: string, label: string, position: Vector = new Vector(0, 0)) {
        this._id = id;
        this._label = label;
        this._dragged = false;
        this._dragShiftX = 0;
        this._dragShiftY = 0;
        this._position = position;
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

    set position(newPosition: Vector) {
        this._position = newPosition;
        this.updateSVG();
    }

    public setPosition(x: number | undefined = undefined, y: number | undefined = undefined) {
        if (x)
            this._position.x = x;
        if (y)
            this._position.y = y;
        this.updateSVG();
    }

    public registerSvg(svg: SVGElement) {
        this._svgElement = svg;
    }

    public registerLabelSvg(svgLabel: SVGElement){
        this._svgLabelElement = svgLabel;
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

    get isDragged(): boolean {
        return this._dragged;
    }

    set isDragged(value: boolean) {
        this._dragged = value;
    }

    getSvgElement(): SVGElement {
        return <SVGElement>this._svgElement;
    }

    getSvgLabelElement(): SVGElement {
        return this._svgLabelElement;
    }
}

