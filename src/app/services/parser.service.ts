import {Injectable} from '@angular/core';
import {TsNode} from "../classes/diagram/tsnode";
import {TsEdge} from "../classes/diagram/tsedge";
import {TsModel} from "../classes/diagram/tsmodel";

@Injectable({
    providedIn: 'root'
})
export class ParserService {


    constructor() {
    }
    parse(text: string): TsModel {
        const lines = text.split('\n');

        const result = new TsModel();
        let sectionMarker = "";

        lines.forEach(line => {
            if (line.trimEnd().length > 0) {
                if(line.trimEnd() === ".nodes"){
                    sectionMarker = "nodes"
                }else if(line.trimEnd() === ".edges"){
                    sectionMarker = "edges"
                }
                else{
                    switch(sectionMarker) {
                        case "nodes": {
                            console.log("node")
                            result.addNode(this.parseNode(line));
                            break;
                        }
                        case "edges": {
                            result.addEdge(this.parseEdge(line, result));
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

    private parseNode(line: string): TsNode {
        let elems = line.split(" ");
        return new TsNode(elems[0].trim(), elems[1].trim());
    }

    private parseEdge(line: string, model: TsModel): TsEdge {
        let elems = line.split(" ");
        const firstNode = model.getNode(elems[3].trim());
        const secondNode = model.getNode(elems[4].trim());
        if (!firstNode) {
            throw new Error("Could not find a node with the ID " + elems[3].trim());
        }
        if (!secondNode) {
            throw new Error("Could not find a node with the ID " + elems[4].trim());
        }
        return new TsEdge(elems[0].trim(), elems[1].trim(), +elems[2].trim(), firstNode, secondNode);
    }


}
