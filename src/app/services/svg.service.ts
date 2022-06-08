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

    private createSvgForNode(element: TsNode): SVGElement {
        const svg = this.createSvgElement('circle');
        svg.setAttribute('cx', `${element.x}`);
        svg.setAttribute('cy', `${element.y}`);
        svg.setAttribute('r', this.circleRadius().toString());
        svg.setAttribute('fill', 'gray');
        element.registerSvg(svg);
        return svg;
    }

    private createSvgForEdge(element: TsEdge): SVGElement {
        const svg = this.createSvgElement('line');

        let x1 = element.x_from;
        let x2 = element.x_to;
        let y1 = element.y_from;
        let y2 = element.y_to;
        //Pfeile beginnen am Kreisrand -> Polarkoordinaten
        const phi = Math.atan2((y2 - y1), (x2 - x1));
        x1 = x1 + this.circleRadius() * Math.cos(phi);
        x2 = x2 - this.circleRadius() * Math.cos(phi);
        y1 = y1 + this.circleRadius() * Math.sin(phi);
        y2 = y2 - this.circleRadius() * Math.sin(phi);

        svg.setAttribute('x1', x1.toString());
        svg.setAttribute('x2', x2.toString());
        svg.setAttribute('y1', y1.toString());
        svg.setAttribute('y2', y2.toString());
        svg.setAttribute('stroke', 'black');
        svg.setAttribute('stroke-width', '3');
        svg.setAttribute('marker-end', "url(#arrow)");

        element.registerSvg(svg);

        return svg;
    }

    private createSvgElement(name: string): SVGElement {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }

    private circleRadius() {
        return 25;
    }
}
