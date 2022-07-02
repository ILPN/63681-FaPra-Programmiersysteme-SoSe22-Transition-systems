import {Injectable} from '@angular/core';
import {TsNode} from "../classes/diagram/tsnode";
import {TsEdge} from "../classes/diagram/tsedge";
import {TsModel} from "../classes/diagram/tsmodel";
import {Vector} from "../classes/spring_embedder/models/vector";
import {TSLineType} from "../util/tsline-type";
import {NodeLineParser} from "../util/node-line-parser";
import {EdgeLineParser} from "../util/edge-line-parser";

@Injectable({
    providedIn: 'root'
})
export class ParserService {

    constructor() {
    }

    parse(text: string): TsModel {
        const lines = text.split('\n');

        const tsModel = new TsModel();
        let currentLineType = TSLineType.UNDEFINED;

        lines.forEach(line => {
            line = line.replace(/\s\s+/g, ' ').trim();
            if (line.length > 0) {
                if (line.trim() === ".nodes") {
                    currentLineType = TSLineType.NODE;
                } else if (line.trim() === ".edges") {
                    currentLineType = TSLineType.EDGE;
                } else {
                    this.parseLine(line, currentLineType, tsModel);
                }
            }
        });
        return tsModel;
    }

    private parseLine(line: string, type: TSLineType, tsModel: TsModel) {
        switch (type) {
            case TSLineType.NODE: {
                tsModel.addNode(this.parseNode(line.trim()));
                break;
            }
            case TSLineType.EDGE: {
                tsModel.addEdge(this.parseEdge(line.trim(), tsModel));
                break;
            }
            default: {
                break;
            }
        }
    }

    private parseNode(line: string): TsNode {
        let nodeLineParser = new NodeLineParser(line);
        let node = new TsNode(nodeLineParser.getID(), nodeLineParser.getLabel());
        if (nodeLineParser.hasCoordinates()) {
            node.setPosition(nodeLineParser.getCoordianteX(), nodeLineParser.getCoordianteY());
        }
        return node;
    }

    private parseEdge(line: string, model: TsModel): TsEdge {
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
            tsEdge.setDragpoint(new Vector(edgeLineParser.getDragPointX(), edgeLineParser.getDragPointY()))
        }
        return tsEdge;
    }

}
