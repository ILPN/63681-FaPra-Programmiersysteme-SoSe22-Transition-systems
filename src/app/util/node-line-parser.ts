import {TSLineType} from "./tsline-type";

export class NodeLineParser {

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

    getCoordianteX(): number {
        if (this.hasCoordinates()) {
            let coordinateX = this.lineElems[2].trim().replace("(", "").replace(")", "").split(",")[0].trim()
            return Number(coordinateX);
        }
        throw new Error("This method can only be called for type EDGES");
    }

    getCoordianteY(): number {
        if (this.hasCoordinates()) {
            let coordinateY = this.lineElems[2].trim().replace("(", "").replace(")", "").split(",")[1].trim()
            return Number(coordinateY);
        }
        throw new Error("This method can only be called for type EDGES");
    }

    hasCoordinates(): Boolean {
        return this.lineElems.length == 3;
    }

}
