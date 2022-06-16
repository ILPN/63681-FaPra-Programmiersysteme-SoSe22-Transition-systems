import {TsElement} from "./tselement";
import {TsNode} from "./tsnode";
import {Vector} from "../spring_embedder/models/vector";

export class TsEdge extends TsElement {

    private _weighting: number;
    private readonly _nodeFrom: TsNode;
    private readonly _nodeTo: TsNode;


    constructor(id: string, label: string, weighting: number, from: TsNode, to: TsNode) {
        super(id, label);
        this._weighting = weighting;
        this._nodeFrom = from;
        from._connectedEdges.add(this);
        this._nodeTo = to;
        to._connectedEdges.add(this);
        this.initializeSvg();
    }

    get nodeFrom(): TsNode {
        return this._nodeFrom;
    }

    get nodeTo(): TsNode {
        return this._nodeTo;
    }

    get position_from(): Vector {
        return this._nodeFrom.position;
    }

    get position_to(): Vector {
        return this._nodeTo.position;
    }

    public updateSVG() {
        //is not needed as public (but also not harmful). But I don´t understand how to declare private in combination with abstract in TSElement.
        //can be done smarter by Vector functions
        let x1 = this.position_from.x;
        let x2 = this.position_to.x;
        let y1 = this.position_from.y;
        let y2 = this.position_to.y;
        //Pfeile beginnen am Kreisrand -> Polarkoordinaten
        const phi = this.position_from.angle(this.position_to);
        x1 = x1 + this._nodeFrom.circleRadius() * Math.cos(phi);
        x2 = x2 - this._nodeFrom.circleRadius() * Math.cos(phi);
        y1 = y1 + this._nodeFrom.circleRadius() * Math.sin(phi);
        y2 = y2 - this._nodeFrom.circleRadius() * Math.sin(phi);

        this._svgElement?.setAttribute('x1', x1.toString());
        this._svgElement?.setAttribute('x2', x2.toString());
        this._svgElement?.setAttribute('y1', y1.toString());
        this._svgElement?.setAttribute('y2', y2.toString());

        // set label-position
        let xTxt = x1 + 0.5 * (x2 - x1);
        let yTxt = y1 + 0.5 * (y2 - y1);
        this._svgLabelElement.setAttribute("x", xTxt.toString());
        this._svgLabelElement.setAttribute("y", yTxt.toString());
    }

    private initializeSvg(): void {
        const svg: SVGElement = <SVGElement>document.createElementNS(this._svgNamespace, 'line');
        svg.setAttribute('stroke', 'black');
        svg.setAttribute('stroke-width', '1');
        svg.setAttribute('marker-end', "url(#arrow)");

        // create label
        // TODO duplicate code like in tsnode.ts
        const text: SVGElement = <SVGElement>document.createElementNS(this._svgNamespace, 'text');
        text.setAttribute("stroke-width", "1");
        text.setAttribute("fill", "black");
        text.setAttribute("font-size", 0.8 * this._nodeFrom.circleRadius() + "px");
        const textNode = document.createTextNode(this._label);
        text.appendChild(textNode)

        this.registerSvg(svg);
        this.registerLabelSvg(text);
        this.updateSVG();
    }
}
