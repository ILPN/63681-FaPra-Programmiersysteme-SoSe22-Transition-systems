import {Point} from '../spring_embedder/models/point'

export abstract class TsElement {
    abstract updateSVG():void;

    protected _position: Point;
    //Das SVGElement samt Funktionen könnte in eine eigene Klasse die dann Instanzvariable von TSElement ist.
    //Momentan sind Logik und Darstellung etwas verschränkt.
    protected _svgElement!: SVGElement;
    protected _dragged: boolean
    protected _dragShiftX: number;
    protected _dragShiftY: number;
    protected _id: string;
    protected readonly _label: string;

    protected constructor(id: string, label: string, position: Point = new Point(0, 0)) {
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

    set x(value: number) {
        //man kann neue Koordinaten setzen ohne das SVG upzudaten. X, Y sollen als Point extrahiert werden.
        //Außerdem muss bei Verändern der Koordinaten zwingen das SVG ebenfalls upgedatet werden.
        this._position.x = value;
    }

    get y(): number {
        return this._position.y;
    }

    set y(value: number) {
        this._position.y = value;
    }

    get position(): Point {
        return this._position;
    }

    set position(newPosition: Point) {
        this._position = newPosition;
    }

    public registerSvg(svg: SVGElement) {
        this._svgElement = svg;
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

    getSvgElement():SVGElement {
        return <SVGElement>this._svgElement;
    }
}

