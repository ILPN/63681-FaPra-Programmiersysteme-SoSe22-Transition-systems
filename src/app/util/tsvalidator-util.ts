import {TSLineType} from "./tsline-type";
import {NodeLineParser} from "./node-line-parser";
import {EdgeLineParser} from "./edge-line-parser";

export class TSValidatorUtil {

    constructor() {
    }

    regExNodeLabel : RegExp = /^\(?[0-1]+\)?$/;
    regExNodeCoordinates : RegExp = /^\(?([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[eE]([+-]?\d+))?,([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[eE]([+-]?\d+))?\)?$/;


    validateTSLine(type: TSLineType, line: string, nodeIDs: Array<string>): boolean {
        let isValid = true;
        switch (type) {
            case TSLineType.TYPETS: {
                if (line.trim().replace(/\s/g, "") != ".typets") {
                    isValid = false;
                }
                break;
            }
            case TSLineType.NODE: {
                let nodeLineParser = new NodeLineParser(line);
                let elems = line.trim().split(" ");
                nodeIDs.push(nodeLineParser.getID());
                if (elems.length != 2 && elems.length != 3) {
                    isValid = false;
                    break
                }
                if(nodeLineParser.hasCoordinates() && !this.regExNodeCoordinates.test(elems[2].trim())){
                    isValid = false;
                    break
                }
                isValid = this.regExNodeLabel.test(nodeLineParser.getLabel());
                break;
            }
            case TSLineType.EDGE: {
                let edgeLineParser = new EdgeLineParser(line);
                let elems = line.trim().split(" ");
                if (elems.length != 5) {
                    isValid = false;
                    break;
                }
                if(edgeLineParser.hasDragPoint() && !this.regExNodeCoordinates.test(elems[5])){
                    isValid = false;
                    break;
                }
                isValid = nodeIDs.some(e => (e === edgeLineParser.getNodeFrom())) && nodeIDs.some(e => (e === edgeLineParser.getNodeTo()));
                break;
            }
            default: {
                break;
            }
        }
        return isValid;
    }
}
