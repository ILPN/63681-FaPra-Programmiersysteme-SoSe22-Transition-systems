import {Injectable} from '@angular/core';
import {TsNode} from "../classes/diagram/tsnode";
import {TsEdge} from "../classes/diagram/tsedge";
import {TsModel} from "../classes/diagram/tsmodel";
import {Vector} from "../classes/spring_embedder/models/vector";

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
                if(line.trim() === ".nodes"){
                    sectionMarker = "nodes"
                }else if(line.trim() === ".edges"){
                    sectionMarker = "edges"
                }
                else{
                    switch(sectionMarker) {
                        case "nodes": {
                            result.addNode(this.parseNode(line.trim()));
                            break;
                        }
                        case "edges": {
                            result.addEdge(this.parseEdge(line.trim(), result));
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
        let node = new TsNode(elems[0].trim(), elems[1].trim());
        if (elems.length == 3){
            let coordinates = elems[2].trim().replace("(","").replace(")","").split(",")
            node.setPosition(+coordinates[0], +coordinates[1]);
        }
        return node;
    }

    private parseEdge(line: string, model: TsModel): TsEdge {
        let elems = line.split(" ");
        const firstNode = model.getNode(elems[3].trim());
        const secondNode = model.getNode(elems[4].trim());
        if (!firstNode) {
            throw new Error("Impossible; should be caught by validator. Could not find a node with the ID " + elems[3].trim());
        }
        if (!secondNode) {
            throw new Error("Impossible; should be caught by validator. Could not find a node with the ID " + elems[4].trim());
        }
        let tsEdge: TsEdge = new TsEdge(elems[0].trim(), elems[1].trim(), +elems[2].trim(), firstNode, secondNode);
        if (elems.length > 5) {
                let dragpoint = elems[5].trim().replace('(','').replace(')','');
                let koord = dragpoint.split(',');
                tsEdge.setDragpoint(new Vector(Number(koord[0]),Number(koord[1])))
            }

        return tsEdge;
    }

}
