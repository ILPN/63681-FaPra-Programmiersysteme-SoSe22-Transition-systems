import {TsElement} from "./tselement";
import {TsEdge} from "./tsedge";

export class TsNode extends TsElement {
    public _connectedEdges: Set<TsEdge>;
    constructor(id: string, label: string, ) {
        super(id, label);
        this._connectedEdges = new Set<TsEdge>();
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
        // @ts-ignore
        this._svgElement.onmousedown = (event) => {
            this.processMouseDown(event);
        };
        // @ts-ignore
        this._svgElement.onmouseup = (event) => {
            this.processMouseUp(event);
        };
        // @ts-ignore
        this._svgElement.onmousemove = (event) => {
            this.processMouseMoving(event);
        }

    }
    private processMouseDown(event: MouseEvent): void {
        this._dragged = true;
        this._dragShiftX = event.clientX - this._x;
        this._dragShiftY = event.clientY - this._y;
    }

    private processMouseMoving(event: MouseEvent): void {
        if (this._dragged) {
            this._x = event.clientX - this._dragShiftX;
            this._y = event.clientY - this._dragShiftY;
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
