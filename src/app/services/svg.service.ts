import {Injectable} from '@angular/core';
import {TsModel} from '../classes/diagram/tsmodel';
import {TsNode} from '../classes/diagram/tsnode';
import {TsEdge} from '../classes/diagram/tsedge';

@Injectable({
    providedIn: 'root'
})
export class SvgService {

    public createSvgElements(diagram: TsModel): Array<SVGElement> {
        const result: Array<SVGElement> = [];
        //Das Defs Element enthält den Marker (Pfeilspitze)
        result.push(this.createDefsElement());
        diagram.nodes.forEach(el => {
            result.push(this.createSvgForNode(el))
        });
        diagram.edges.forEach(el => {
           result.push(this.createSvgForEdge(el));
        });
        return result;
    }

    createDefsElement(): SVGElement {
       let defs = this.createSvgElement('defs');
       let marker = this.createSvgElement('marker');
        let path = this.createSvgElement('path');
        //Der Path gibt die drei Punkte der Pfeilspitze an
        path.setAttribute('d','M 0,0 l 8,5 l -8,5 z')
        marker.setAttribute('id', 'arrow');
        marker.setAttribute('refX', '8');
        marker.setAttribute('refY', '5');
        marker.setAttribute('markerWidth', '10');
        marker.setAttribute('markerHeight', '10');
        marker.setAttribute('orient', "auto");
        marker.appendChild(path);
       defs.appendChild(marker);
       return defs;
    }

    public createSvgForNode(element: TsNode): SVGElement {
        const svg = this.createSvgElement('circle');
        svg.setAttribute('r', element.circleRadius().toString());
        svg.setAttribute('fill', 'gray');
        element.registerSvg(svg);
        element.updateSVG();
        return svg;
    }

    public createSvgForEdge(element: TsEdge): SVGElement {
        const svg = this.createSvgElement('line');
        svg.setAttribute('stroke', 'black');
        svg.setAttribute('stroke-width', '3');
        svg.setAttribute('marker-end', "url(#arrow)");
        element.registerSvg(svg);
        element.updateSVG();
        return svg;
    }

    private createSvgElement(name: string): SVGElement {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }

}
