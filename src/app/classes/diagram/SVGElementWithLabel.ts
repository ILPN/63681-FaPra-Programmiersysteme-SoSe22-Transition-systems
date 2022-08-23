
export abstract class SVGElementWithLabel {
    public static circleRadius: number = 25;
    protected _dragged!: boolean;
    private _svgElement: SVGElement;


    constructor(qualifiedName: string) {
        this._svgElement = <SVGElement>document.createElementNS(SVGElementWithLabel.svgNamespace(), qualifiedName);
    }

    protected static svgNamespace(): string {
        return 'http://www.w3.org/2000/svg';
    }

    abstract setUpSVGAttributes(): void;

    abstract setUpTextAttributes(): void;

    abstract setLabelAttribute(qualifiedName: string, value: string):void;

    get svgElement(): SVGElement {
        return this._svgElement;
    }

    setAttribute(qualifiedName: string, value: string) {
        this.svgElement.setAttribute(qualifiedName, value);
    }

    protected setUpMouseEvents() {
        this._dragged = false;
        this._svgElement.onmousedown = () => {
            this.processMouseDown();
        }
        this.setUpMouseEventsForLabel()

    }

    protected processMouseDown(): void {
        this._dragged = true;
    }

    get isDragged(): boolean {
        return this._dragged;
    }

    set isDragged(value: boolean) {
        this._dragged = value;
    }

    abstract setUpMouseEventsForLabel(): void;


}
