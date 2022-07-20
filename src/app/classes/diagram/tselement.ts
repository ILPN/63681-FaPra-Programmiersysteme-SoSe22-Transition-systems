import {SVGElementWithLabel} from "./SVGElementWithLabel";

export abstract class TsElement {

    abstract updateSVG(): void;
    abstract setPosition(x: number, y: number): void;

    protected _svgElement!: SVGElementWithLabel;
    protected _id: string;
    protected readonly _label: string;

    protected constructor(id: string, label: string) {
        this._id = id;
        this._label = label;
    }

    public registerSvg(svg: SVGElementWithLabel) {
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
        return this._svgElement.isDragged;
    }

    set isDragged(value: boolean) {
        this._svgElement.isDragged = value;
    }

    getSvgElement(): SVGElement {
        return this._svgElement.svgElement;
    }

    getSvgLabelElement(): SVGElement[] {
        return this._svgElement.labelElements;
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

    hideProperties(){
        this._svgElement.setAttribute('stroke', 'black');
        this._svgElement.setLabelAttribute('fill', 'black');
    }
    isNode():Boolean{
        return false;
    }

}

