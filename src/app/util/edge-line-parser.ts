import {Vector} from "../classes/spring_embedder/models/vector";
import {TsTransition} from "../classes/diagram/tsTransition";

export class EdgeLineParser {
    line;
    lineElems;

    constructor(line: string) {
        this.line = line;
        this.lineElems = line.split(" ");
    }

    //TODO Should return transition objects as soon as the class is created
    getTransitions() : TsTransition[]{
        let transitions : TsTransition[] = [];
        for (let i = 2; i < this.lineElems.length; i++) {
            if(this.lineElems[i].trim().startsWith("(") && this.lineElems[i].trim().endsWith(")")){
                continue;
            }
            transitions.push(new TsTransition(this.lineElems[i]));
        }
        return transitions;

    }

    getNodeFrom(): string {
        return this.lineElems[0].trim();
    }

    getNodeTo(): string {
        return this.lineElems[1].trim();
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

    getDragPoint(): Vector {
        if (this.hasDragPoint()) {
            let x = this.lineElems[5].trim().replace("(", "").replace(")", "").split(",")[0].trim()
            let y = this.lineElems[5].trim().replace("(", "").replace(")", "").split(",")[1].trim()
            return new Vector(Number(x),Number(y));
        }
        throw new Error("This method can only be called for type EDGES");
    }

    hasDragPoint(): Boolean {
        //TODO return false until it s clarified how drag points should be define
        return false;
    }
}
