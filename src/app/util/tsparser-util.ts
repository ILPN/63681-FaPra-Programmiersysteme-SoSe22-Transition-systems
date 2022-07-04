import {TsNode} from "../classes/diagram/tsnode";
import {NodeLineParser} from "./node-line-parser";
import {TsModel} from "../classes/diagram/tsmodel";
import {TsEdge} from "../classes/diagram/tsedge";
import {EdgeLineParser} from "./edge-line-parser";

export class TSParserUtil {

    parseNode(line: string): TsNode {
        let nodeLineParser = new NodeLineParser(line);
        let node = new TsNode(nodeLineParser.getID(), nodeLineParser.getLabel());
        if (nodeLineParser.hasCoordinates()) {
            node.setPosition(nodeLineParser.getCoordinateX(), nodeLineParser.getCoordinateY());
        }
        return node;
    }

    parseEdge(line: string, model: TsModel): TsEdge {
        let edgeLineParser = new EdgeLineParser(line);
        const nodeFrom = model.getNode(edgeLineParser.getNodeFrom());
        const nodeTo = model.getNode(edgeLineParser.getNodeTo());
        if (!nodeFrom) {
            throw new Error("Impossible; should be caught by validator. Could not find a node with the ID " + edgeLineParser.getNodeFrom());
        }
        if (!nodeTo) {
            throw new Error("Impossible; should be caught by validator. Could not find a node with the ID " + edgeLineParser.getNodeTo());
        }
        let tsEdge: TsEdge = new TsEdge(edgeLineParser.getID(), edgeLineParser.getLabel(), edgeLineParser.getWeight(), nodeFrom, nodeTo);
        if (edgeLineParser.hasDragPoint()) {
            tsEdge.setDragpoint(edgeLineParser.getDragPoint());
        }
        return tsEdge;
    }

    getTSContentToDisplay(text: string): string {
        const lines = text.trim().split('\n');
        let result = ".type ts\n";
        let sectionMarker = "";
        lines.forEach(line => {
            if (line.trimEnd().length > 0) {
                if (line.trim() === ".nodes") {
                    sectionMarker = "nodes"
                    result = result + line + "\n";
                } else if (line.trim() === ".edges") {
                    sectionMarker = "edges"
                    result = result + line + "\n";
                } else {
                    switch (sectionMarker) {
                        case "nodes": {
                            let elems = line.split(" ");
                            result = result + elems[0] + " " + elems[1] + "\n"
                            break;
                        }
                        case "edges": {
                            result = result + line + "\n";
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                }
            }
        });
        return result;
    }
}
