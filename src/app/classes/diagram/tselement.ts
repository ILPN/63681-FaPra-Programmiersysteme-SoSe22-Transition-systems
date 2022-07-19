import {CircleElementWithLabel} from "./CircleElementWithLabel";
import {CurvedPathElementWithLabel} from "./CurvedPathElementWithLabel";
import {SVGElementWithLabel} from "./SVGElementWithLabel";

export abstract class TsElement {

    abstract updateSVG(): void;
    abstract setPosition(x: number, y: number): void;

    protected _svgElement!: SVGElementWithLabel;
    protected _dragged: boolean
    protected _id: string;
    protected readonly _label: string;

    protected constructor(id: string, label: string) {
        this._id = id;
        this._label = label;
        this._dragged = false;

    }

    public registerSvg(svg: CircleElementWithLabel|CurvedPathElementWithLabel) {
        this._svgElement = svg;
        this._svgElement.svgElement.onmousedown = (event) => {
            this.processMouseDown();
        }
        this._svgElement.labelElement.onmousedown = (event) => {
            this.processMouseDown();
        }
    }

    private processMouseDown(): void {
        this._dragged = true;
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
        return this._svgElement.svgElement;
    }

    getSvgLabelElement(): SVGElement {
        return this._svgElement.labelElement;
    }

    get svgElement(): SVGElementWithLabel {
        return this._svgElement;
    }

    highlightCycleElement() {
        this._svgElement.setAttribute('stroke', 'lightblue');
        this._svgElement.setLabelAttribute('fill', 'lightblue');
    }

    highlightNonReachableElement() {
        this._svgElement.setAttribute('stroke', 'lightgrey');
        this._svgElement.setLabelAttribute('fill', 'lightgrey');
    }

}

