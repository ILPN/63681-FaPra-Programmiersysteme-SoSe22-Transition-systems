

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

    getCoordinateX(): number {
        if (this.hasCoordinates()) {
            let coordinateX = this.lineElems[2].trim().replace("(", "").replace(")", "").split(",")[0].trim()
            return Number(coordinateX);
        }
        throw new Error("This method can only be called for type EDGES");
    }

    getCoordinateY(): number {
        if (this.hasCoordinates()) {
            let coordinateY = this.lineElems[2].trim().replace("(", "").replace(")", "").split(",")[1].trim()
            return Number(coordinateY);
        }
        throw new Error("This method can only be called for type EDGES");
    }

    getCoordinates(): Array<number> {
        let coordinates = new Array()
        if (this.hasCoordinates()) {
            coordinates[0] = this.lineElems[2].trim().replace("(", "").replace(")", "").split(",")[0].trim()
            coordinates[1] = this.lineElems[2].trim().replace("(", "").replace(")", "").split(",")[1].trim()
            return coordinates;
        }
        throw new Error("This method can only be called for type EDGES");
    }

    hasCoordinates(): Boolean {
        return this.lineElems.length == 3;
    }

}
