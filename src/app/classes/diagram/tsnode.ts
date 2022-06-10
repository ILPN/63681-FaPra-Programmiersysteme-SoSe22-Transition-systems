import {TsElement} from "./tselement";
import {TsEdge} from "./tsedge";

export class TsNode extends TsElement {
    public _connectedEdges: Set<TsEdge>;
    constructor(id: string, label: string, ) {
        super(id, label);
        this._connectedEdges = new Set<TsEdge>();
        this.initializeSvg();
    }

    private initializeSvg() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        svg.setAttribute('r', this.circleRadius().toString());
        svg.setAttribute('fill', 'gray');
        this.registerSvg(svg);
        this.updateSVG();
    }

    public updateSVG() {
        this._svgElement?.setAttribute('cx', `${this._x}`);
        this._svgElement?.setAttribute('cy', `${this._y}`);
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
        this._dragShiftX = event.offsetX - this._x;
        this._dragShiftY = event.offsetY - this._y;
    }

    private processMouseMoving(event: MouseEvent): void {
        if (this._dragged) {
            this._x = event.offsetX - this._dragShiftX;
            this._y = event.offsetY - this._dragShiftY;
            this.updateSVG()
        }
    }
    private processMouseLeave(event: MouseEvent): void {
        if (this._dragged) {
            //Node centern, damit wird verhindert, dass man die Node verliert, wenn man zu schnell über den Bildschirm wischt s. TRAN-58
            this._x = event.offsetX ;
            this._y = event.offsetY ;
            this.updateSVG()
        }

    }

    private processMouseUp(event: MouseEvent): void {
        this._dragged = false;
    }
    public circleRadius():number {
        return 25;
    }
}
