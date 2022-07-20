export abstract class SVGElementWithLabel {
    //TODO wieso befindet sich diese Eigenschaft nicht in CircleElementWithLabel?
    public static circleRadius: number = 25;
    public static  FULL_X = window.innerWidth/1.1;
    public static  FULL_Y = window.innerHeight/3;
    private _dragged!: boolean;
    private _svgElement: SVGElement;
    private _labelElements: SVGElement[];

    protected constructor(qualifiedName: string, label: string) {
        this._svgElement = <SVGElement>document.createElementNS(SVGElementWithLabel.svgNamespace(), qualifiedName);
        this._svgElement = <SVGElement>document.createElementNS(SVGElementWithLabel.svgNamespace(), qualifiedName);
        this._labelElements = [];
        let labelAsArray = label.split(",");
        labelAsArray.reverse();

        let tran = labelAsArray.pop()
        let labelElement = <SVGElement>document.createElementNS(SVGElementWithLabel.svgNamespace(), 'text');
        if (tran) {
            let textNode = document.createTextNode(tran);
            labelElement.appendChild(textNode);
            this._labelElements.push(labelElement);
        }
        while (labelAsArray.length > 0){
            this.createElement(", ");
            let t = labelAsArray.pop()
            this.createElement(t!);
        }

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

    private createElement(t: string) {
        let labelElement = <SVGElement>document.createElementNS(SVGElementWithLabel.svgNamespace(), 'text');
        let textNode = document.createTextNode(t!);
        labelElement.appendChild(textNode);
        this._labelElements.push(labelElement);
    }

    private static svgNamespace(): string {
        return 'http://www.w3.org/2000/svg';
    }

    abstract setUpSVGAttributes(): void;

    abstract setUpTextAttributes(): void;

    get labelElements(): SVGElement[] {
        return this._labelElements;
    }

    get svgElement(): SVGElement {
        return this._svgElement;
    }

    setAttribute(qualifiedName: string, value: string) {
        this.svgElement.setAttribute(qualifiedName, value);
    }

    setLabelAttribute(qualifiedName: string, value: string) {
        for (let l of this.labelElements) {
            l.setAttribute(qualifiedName, value);
        }
    }

    private setUpMouseEvents() {
        this._dragged = false;
        this._svgElement.onmousedown = () => {
            this.processMouseDown();
        }
        for (let l of this._labelElements) {
            l.onmousedown = () => {
                this.processMouseDown();
            }
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
