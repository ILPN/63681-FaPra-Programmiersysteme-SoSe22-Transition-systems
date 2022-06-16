import {TsElement} from "./tselement";
import {TsEdge} from "./tsedge";

export class TsNode extends TsElement {
    public _connectedEdges: Set<TsEdge>;

    constructor(id: string, label: string,) {
        super(id, label);
        this._connectedEdges = new Set<TsEdge>();
        this.initializeSvg();
    }

    private initializeSvg() {
        const svg: SVGElement = <SVGElement>document.createElementNS(this._svgNamespace, 'circle');
        svg.setAttribute('r', this.circleRadius().toString());
        svg.setAttribute('fill', 'white');
        svg.setAttribute("stroke", "black");
        svg.setAttribute("stroke-width", "1");

        // create label
        const text: SVGElement = <SVGElement>document.createElementNS(this._svgNamespace, 'text');
        text.setAttribute("stroke-width", "1");
        text.setAttribute("fill", "black");
        text.setAttribute("font-size", 0.8 * this.circleRadius() + "px");
        const textNode = document.createTextNode(this._label);
        text.appendChild(textNode)

        this.registerSvg(svg);
        this.registerLabelSvg(text);
        this.updateSVG();
    }

    public updateSVG() {
        //is not needed as public (but also not harmful). But I don´t understand how to declare private in combination with abstract in TSElement.
        this._svgElement?.setAttribute('cx', `${this.position.x}`);
        this._svgElement?.setAttribute('cy', `${this.position.y}`);
        // set label-position
        // TODO dependent on circle-radius?
        let xTxt = this._position.x - 0.5 * this.circleRadius();
        let yTxt = this._position.y + 0.3 * this.circleRadius();
        this._svgLabelElement.setAttribute("x", xTxt.toString());
        this._svgLabelElement.setAttribute("y", yTxt.toString());

        this._connectedEdges.forEach(e => {
            e.updateSVG()
        })
    }


    public override registerSvg(svg: SVGElement) {
        super.registerSvg(svg);
        this._svgElement.onmousedown = (event) => {
            this.processMouseDown(event);
        };
        this._svgElement.onmouseup = (event) => {
            this.processMouseUp(event);
        };
        this._svgElement.onmousemove = (event) => {
            this.processMouseMoving(event);
        }
        this._svgElement.onmouseleave = (event) => {
            this.processMouseLeave(event);
        }

    }

    private processMouseDown(event: MouseEvent): void {
        this._dragged = true;
        this.setPosition(event.offsetX - this._dragShiftX, event.offsetY - this._dragShiftY);
    }

    private processMouseMoving(event: MouseEvent): void {
        if (this._dragged) {
            this.setPosition(event.offsetX - this._dragShiftX, event.offsetY - this._dragShiftY);
        }
    }

    private processMouseLeave(event: MouseEvent): void {
        if (this._dragged) {
            //Node centern, damit wird verhindert, dass man die Node verliert, wenn man zu schnell über den Bildschirm wischt s. TRAN-58
            this.setPosition(event.offsetX, event.offsetY);

        }

    }

    private processMouseUp(event: MouseEvent): void {
        //TODO tbd?
        this._dragged = false;
    }

    public circleRadius(): number {
        return 25;
    }
}
