import {Injectable} from '@angular/core';
import {TsModel} from "../classes/diagram/tsmodel";
import {TsNode} from "../classes/diagram/tsnode";

interface PNMLEdge {
    id: string,
    label: string,
    from: TsNode,
    to: TsNode

}

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
        let PNMLEdges = this.generatePNMLEdges(model);
        let result = '';
        let arcIndex = 1;
        result += '<?xml version="1.0" encoding="UTF-8"?>\n';
        result += '<pnml>\n';
        result += '<net>\n';
        for (let node of model.nodes) {
            result += this.generatePNMLPlace(node)
        }
        for (let edge of PNMLEdges) {
            result += this.generatePNMLTransition(edge);
        }
        for (let edge of PNMLEdges) {
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

    private generatePNMLTransition(edge: PNMLEdge): string {
        let result = '<transition  id=\"' + edge.id + '\">\n';
        result += '<name>\n';
        result += '<text>' + edge.label + '</text>\n';
        result += '</name>\n';
        result += '<graphics>\n';
        result += '<position x=\"' + "" + '\" y=\"' + "" + '\"/>\n';
        result += '</graphics>\n';
        result += '</transition>\n';
        return result;
    }

    private generatePNMLArc(edge: PNMLEdge, index: Number): string {
        let result = '<arc  id=\"a' + index + '\" ';
        let index2 = Number(index) + 1;
        result += 'source=\"' + edge.from.id + '\" ';
        result += 'target=\"' + edge.id + '\" ';
        result += '/>\n';
        result += '<arc  id=\"a' + index2 + '\" ';
        result += 'source=\"' + edge.id + '\" ';
        result += 'target=\"' + edge.to.id + '\" ';
        result += '/>\n';
        return result;
    }

    private generatePNMLEdges(model: TsModel): PNMLEdge[] {
        let PNMLEdges: PNMLEdge[] = [];
        let edgeIndex = 1;
        for (let edge of model.edges) {
            let labels = edge.getTransitionLabels();
            if (labels.length > 1) {
                labels.forEach((value, index) => {
                    PNMLEdges.push(
                        {
                            id: 't' + edgeIndex,
                            label: value,
                            from: edge.nodeFrom,
                            to:edge.nodeTo
                        }
                    )
                    edgeIndex++;
                })
            } else {
                PNMLEdges.push(
                    {
                        id: 't' + edgeIndex,
                        label: edge.writeTransitionLabelsOn('',','),
                        from: edge.nodeFrom,
                        to:edge.nodeTo
                    }
                )
                edgeIndex++;
            }
        }
        return PNMLEdges;
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
