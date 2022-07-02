import {TSLineType} from "./tsline-type";

export class EdgeLineParser {
    line;
    lineElems;

    constructor(line: string) {
        this.line = line;
        this.lineElems = line.split(" ");
    }

    getID(): string {
        return this.lineElems[0].trim();
    }

    getLabel(): string {
        return this.lineElems[1].trim();
    }

    getWeight(): number {
        return Number(this.lineElems[2].trim());
    }

    getNodeFrom(): string {
        return this.lineElems[3].trim();
    }

    getNodeTo(): string {
        return this.lineElems[4].trim();
    }

    getDragPointX(): number {
        if (this.hasDragPoint()) {
            let coordinateX = this.lineElems[5].trim().replace("(", "").replace(")", "").split(",")[0].trim()
            return Number(coordinateX);
        }
        throw new Error("This method can only be called for type EDGES");
    }

    getDragPointY(): number {
        if (this.hasDragPoint()) {
            let coordinateY = this.lineElems[5].trim().replace("(", "").replace(")", "").split(",")[1].trim()
            return Number(coordinateY);
        }
        throw new Error("This method can only be called for type EDGES");
    }

    hasDragPoint(): Boolean {
        return this.lineElems.length > 5;
    }
}
