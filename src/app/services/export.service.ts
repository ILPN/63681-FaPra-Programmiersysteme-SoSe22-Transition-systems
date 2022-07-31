import {Injectable} from '@angular/core';
import {TsModel} from "../classes/diagram/tsmodel";
import {TsNode} from "../classes/diagram/tsnode";
import {TsEdge} from "../classes/diagram/tsedge";
import {Vector} from "../classes/spring_embedder/models/vector";

@Injectable({
    providedIn: 'root'
})
export class ExportService {

    constructor() {
    }

    exportTS(model: TsModel): string {
        let result = '';
        result += '.type ts\n';
        result += '.nodes\n';
        for (let node of model.nodes) {
            result = node.writeOn(result);
        }
        result += '.edges\n';
        for (let edge of model.edges) {
            result = edge.writeOn(result);
        }
        return result;
    }

    exportPNML(model: TsModel): string {
        let result = '';
        let arcs = '';
        let transitions = '';
        let places = '';
        let arcIndex = 1;
        let transitionIndex = 1;
        result += '<?xml version="1.0" encoding="UTF-8"?>\n';
        result += '<pnml>\n';
        result += '<net>\n';

        //Generate places
        for (let node of model.nodes) {
            places += this.generatePNMLPlace(node)
        }

        //generates transitions and arcs
        for (let edge of model.edges) {
            let tranLabelCount = 0;
            for(let label of edge.getTransitionLabels()){
                let pos = this.calculateTransitionPosition(edge, tranLabelCount);
                let transitionsId :string = "t" + transitionIndex;
                transitions += this.generatePNMLTransition(transitionsId, label, pos);
                arcs += this.generatePNMLArc(edge, arcIndex, transitionsId);
                transitionIndex++;
                arcIndex = Number(arcIndex) + 2;
                tranLabelCount++;

            }
        }
        result += places;
        result += transitions;
        result += arcs;

        result += '</net>\n';
        result += '</pnml>\n';
        return this.formatXML(result);

    }


    calculateTransitionPosition(edge: TsEdge, tranLabelCount: number) {
        let offSet = tranLabelCount * 30;
        let x = ((edge.nodeFrom.x + edge.nodeTo.x)/2).toFixed(2)
        let y = ((edge.nodeFrom.y + edge.nodeTo.y)/2).toFixed(2)
        return new Vector(Number(x),Number(y)+offSet);
    }

    private generatePNMLPlace(node: TsNode): string {
        let result = '<place id=\"' + node.id + '\">\n';
        result += '<name>\n';
        result += '<text>' + node.label + '</text>\n';
        result += '</name>\n';
        // result += '<initialMarking>\n';
        // result += '<text>' + 0 + '</text>\n';
        // result += '</initialMarking>\n';
        result += '<graphics>\n';
        result += '<position x=\"' + node.x.toFixed(2) + '\" y=\"' + node.y.toFixed(2) + '\"/>\n';
        result += '</graphics>\n';
        result += '</place>\n';
        return result;
    }

    private generatePNMLTransition(id: string, label:string, position:Vector): string {
        let result = '<transition  id=\"' + id + '\">\n';
        result += '<name>\n';
        result += '<text>' + label + '</text>\n';
        result += '</name>\n';
        result += '<graphics>\n';
        result += '<position x=\"' + position.x + '\" y=\"' + position.y + '\"/>\n';
        result += '</graphics>\n';
        result += '</transition>\n';
        return result;
    }

    private generatePNMLArc(edge: TsEdge, arcIndex: number, tansitionId: string): string {
        let result = '<arc  id=\"a' + arcIndex + '\" ';
        let arcIndex2 = Number(arcIndex) + 1;
        result += 'source=\"' + edge.nodeFrom.id + '\" ';
        result += 'target=\"' + tansitionId + '\" ';
        result += '/>\n';
        result += '<arc  id=\"a' + arcIndex2 + '\" ';
        result += 'source=\"' + tansitionId + '\" ';
        result += 'target=\"' + edge.nodeTo.id + '\" ';
        result += '/>\n';
        return result;
    }


    private formatXML(xml: string): string {
        let formatted = '', indent= '';
        let tab = '\t';
        xml.split(/>\s*</).forEach(function(node) {
            if (node.match( /^\/\w/ )) indent = indent.substring(tab.length); // decrease indent by one 'tab'
            formatted += indent + '<' + node + '>\r\n';
            if (node.match( /^<?\w[^>]*[^\/]$/ )) indent += tab;              // increase indent
        });
        return formatted.substring(1, formatted.length - 3);
    }
}
