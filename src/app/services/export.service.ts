import {Injectable} from '@angular/core';
import {TsModel} from "../classes/diagram/tsmodel";
import {TsNode} from "../classes/diagram/tsnode";
import {TsEdge} from "../classes/diagram/tsedge";

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
        let arcIndex = 1;
        result += '<?xml version="1.0" encoding="UTF-8"?>\n';
        result += '<pnml>\n';
        result += '<net>\n';
        for (let node of model.nodes) {
            result += this.generatePNMLPlace(node)
        }
        for (let edge of model.edges) {
            result += this.generatePNMLTransition(edge);
        }
        for (let edge of model.edges) {
            result += this.generatePNMLArc(edge, arcIndex);
            arcIndex = Number(arcIndex) + 2;
        }
        result += '</net>\n';
        result += '</pnml>\n';
        return this.formatXML(result);

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

    private generatePNMLTransition(edge: TsEdge): string {
        let result = '<transition  id=\"' + edge.id + '\">\n';
        result += '<name>\n';
        result += '<text>' + edge.label + '</text>\n';
        result += '</name>\n';
        // result += '<graphics>\n';
        // result += '<position x=\"' + "" + '\" y=\"' + "" + '\"/>\n';
        // result += '</graphics>\n';
        result += '</transition>\n';
        return result;
    }

    private generatePNMLArc(edge: TsEdge, index: Number): string {
        let result = '<arc  id=\"a' + index + '\" ';
        let index2 = Number(index) + 1;
        result += 'source=\"' + edge.nodeFrom.id + '\" ';
        result += 'target=\"' + edge.id + '\" ';
        result += '/>\n';
        result += '<arc  id=\"a' + index2 + '\" ';
        result += 'source=\"' + edge.id + '\" ';
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
        let resultXml = formatted.substring(1, formatted.length-3);
        return resultXml;
    }
}
