export abstract class SVGElementWithLabel {
    //TODO wieso befindet sich diese Eigenschaft nicht in CircleElementWithLabel?
    public static circleRadius: number = 25;
    public static  FULL_X = window.innerWidth/1.1;
    public static  FULL_Y = window.innerHeight/3;
    protected _dragged!: boolean;
    private _svgElement: SVGElement;


    constructor(qualifiedName: string) {
        this._svgElement = <SVGElement>document.createElementNS(SVGElementWithLabel.svgNamespace(), qualifiedName);
        this.getScreenSizeFromCanvas();
    }

    private getScreenSizeFromCanvas() {
        let xSize = document.getElementById('canvasDisplay')?.offsetWidth;
        let ySize = document.getElementById('canvasDisplay')?.offsetHeight;
        if (xSize != null && ySize != null) {
            SVGElementWithLabel.FULL_X = xSize;
            SVGElementWithLabel.FULL_Y = ySize;
        }
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
