export abstract class SVGElementWithLabel {

    public static circleRadius: number = 25;
    public static  FULL_X = window.innerWidth/1.1;
    public static  FULL_Y = window.innerHeight/3;
    private _dragged!: boolean;
    private _svgElement: SVGElement;
    private _labelElement: SVGElement;

    protected constructor(qualifiedName: string, label: string) {
        this._svgElement = <SVGElement>document.createElementNS(SVGElementWithLabel.svgNamespace(), qualifiedName);
        this._labelElement = <SVGElement>document.createElementNS(SVGElementWithLabel.svgNamespace(), 'text');
        let textNode = document.createTextNode(label);
        this._labelElement.appendChild(textNode);

        let xSize = document.getElementById('canvasDisplay')!.offsetWidth;
        let ySize = document.getElementById('canvasDisplay')!.offsetHeight;
        if(xSize != null && ySize != null){
            SVGElementWithLabel.FULL_X = xSize;
            SVGElementWithLabel.FULL_Y = ySize;
        }

        this.setUpMouseEvents();
        this.setUpSVGAttributes();
        this.setUpTextAttributes();
    }

    private static svgNamespace(): string {
        return 'http://www.w3.org/2000/svg';
    }

    abstract setUpSVGAttributes(): void;

    abstract setUpTextAttributes(): void;

    get labelElement(): SVGElement {
        return this._labelElement;
    }

    get svgElement(): SVGElement {
        return this._svgElement;
    }

    setAttribute(qualifiedName: string, value: string) {
        this.svgElement.setAttribute(qualifiedName, value);
    }

    setLabelAttribute(qualifiedName: string, value: string) {
        this.labelElement.setAttribute(qualifiedName, value);
    }

    private setUpMouseEvents() {
        this._dragged = false;
        this._svgElement.onmousedown = () => {
            this.processMouseDown();
        }
        this._labelElement.onmousedown = () => {
            this.processMouseDown();
        }
    }

    private processMouseDown(): void {
        this._dragged = true;
    }

    get isDragged(): boolean {
        return this._dragged;
    }

    set isDragged(value: boolean) {
        this._dragged = value;
    }
}
