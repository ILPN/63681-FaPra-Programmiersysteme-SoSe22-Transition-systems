import {Injectable} from '@angular/core';
import {Diagram} from '../classes/diagram/diagram';
import {Element} from '../classes/diagram/element';
import {TsNode} from "../classes/diagram/tsnode";
import {TsEdge} from "../classes/diagram/tsedge";

@Injectable({
    providedIn: 'root'
})
export class ParserService {

    constructor() {
    }
    nodes: TsNode[] = [];
    parse(text: string): Diagram | undefined {
        const lines = text.split('\n');

        const result = new Diagram();
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
                            result.addElement(this.parseNode(line));
                            break;
                        }
                        case "edges": {
                            result.addElement(this.parseEdge(line));
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

    private parseNode(line: string): Element {
        let elems = line.split(" ");
        let node = new TsNode(elems[0].trim(), elems[1].trim());
        this.nodes.push(node);
        return node;
    }

    private parseEdge(line: string): Element {
        let elems = line.split(" ");
        return new TsEdge(elems[0].trim(), this.getNode(elems[3].trim()), this.getNode(elems[4].trim()));
    }

    private getNode(id: string): TsNode {
        for (let item of this.nodes) {
            if (item.id === id) {
                return item;
            }
        }
        throw new Error("Could not find a node with the ID " + id);
    }
}
