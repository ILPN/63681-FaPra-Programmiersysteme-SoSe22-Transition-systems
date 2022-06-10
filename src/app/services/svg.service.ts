import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SvgService {
    //Diese Klasse kann entweder entfernt werden. Dann muss das Defs Element woanders definiert werden.
    //Oder die Definitionen der Nodes und Edges SVGs werden hierhin zurückgeschoben.
    public static createDefsElement(): SVGElement {
       let defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
       let marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
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


}
