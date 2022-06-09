export abstract class TsElement {

    protected _x: number;
    protected _y: number;
    protected _svgElement: SVGElement | undefined;
    protected _dragged: boolean
    protected _dragShiftX: number;
    protected _dragShiftY: number;
    protected _id: string;
    protected readonly _label: string;

    protected constructor(id: string, label: string) {
        this._x = 0;
        this._y = 0;
        this._id = id;
        this._label = label;
        this._dragged = false;
        this._dragShiftX = 0;
        this._dragShiftY = 0;
    }

    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
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


}

