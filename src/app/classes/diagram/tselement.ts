import {SVGElementWithLabel} from "./SVGElementWithLabel";

export abstract class TsElement {

    abstract updateSVG(): void;
    abstract setPosition(x: number, y: number): void;

    protected _svgElement!: SVGElementWithLabel;

    public registerSvg(svg: SVGElementWithLabel) {
        this._svgElement = svg;
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

