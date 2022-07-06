
export abstract class SVGElementWithLabel {

    public static circleRadius: number = 25;
    public static readonly FULL_X = 1296;
    public static readonly FULL_Y = 400;

    get labelElement(): SVGElement {
        return this._labelElement;
    }

    get svgElement(): SVGElement {
        return this._svgElement;
    }

    private _svgElement: SVGElement;
    private _labelElement: SVGElement;

    protected constructor(qualifiedName: string, label: string) {
        this._svgElement = <SVGElement>document.createElementNS(SVGElementWithLabel.svgNamespace(), qualifiedName);
        this._labelElement = <SVGElement>document.createElementNS(SVGElementWithLabel.svgNamespace(), 'text');
        let textNode = document.createTextNode(label);
        this._labelElement.appendChild(textNode);
        this.setUpSVGAttributes();
        this.setUpTextAttributes();
    }

    private static svgNamespace(): string {
        return 'http://www.w3.org/2000/svg';
    }

    abstract setUpSVGAttributes(): void;

    abstract setUpTextAttributes(): void;

    setAttribute(qualifiedName: string, value: string) {
        this.svgElement.setAttribute(qualifiedName,value);
    }

    setLabelAttribute(qualifiedName: string, value: string) {
        this.labelElement.setAttribute(qualifiedName,value);
    }

}
