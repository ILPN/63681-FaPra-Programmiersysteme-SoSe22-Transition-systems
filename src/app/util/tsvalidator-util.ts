import {TSLineType} from "./tsline-type";
import {NodeLineParser} from "./node-line-parser";
import {EdgeLineParser} from "./edge-line-parser";
import {IsValid} from "./is-valid";

export class TSValidatorUtil {

    constructor() {
    }

    regExNodeCoordinates: RegExp = /^\(?([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[eE]([+-]?\d+))?,([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[eE]([+-]?\d+))?\)?$/;
    regExEdgeWeighting: RegExp = /^[0-9]+$/;


    validateTSLine(type: TSLineType, line: string, nodeIDs: Array<string>): IsValid {
        let isValid: IsValid = new IsValid(true, "");
        switch (type) {
            case TSLineType.TYPETS: {
                if (line.trim().replace(/\s/g, "") != ".typets") {
                    let message = "Line \"" + line + "\" not valid";
                    isValid = new IsValid(false, message);
                    break;
                }
                break;
            }
            case TSLineType.NODE: {
                let nodeLineParser = new NodeLineParser(line);
                let elems = line.trim().split(" ");
                nodeIDs.push(nodeLineParser.getID());
                if (elems.length != 2 && elems.length != 3) {
                    let message = "Line \"" + line + "\" not valid\nThe number of elements should be 2 or 3 but was " + elems.length;
                    isValid = new IsValid(false, message);
                    break
                }
                if (nodeLineParser.hasCoordinates() && !this.regExNodeCoordinates.test(elems[2].trim())) {
                    let message = "Line \"" + line + "\"\nElement 3 must have coordinates format (x,y)";
                    isValid = new IsValid(false, message);
                    break
                }
                break;
            }
            case TSLineType.EDGE: {
                let edgeLineParser = new EdgeLineParser(line);
                let elems = line.trim().split(" ");
                if (elems.length < 3) {
                    let message = "Line \"" + line + "\" not valid\nAn edge must have at least 3 elements but was " + elems.length;
                    isValid = new IsValid(false, message);
                    break;
                }
                if (edgeLineParser.hasDragPoint() && !this.regExNodeCoordinates.test(elems[5])) {
                    let message = "Line \"" + line + "\"\nElement 5 must have coordinates format (x,y)";
                    isValid = new IsValid(false, message);
                    break;
                }
                if (!nodeIDs.some(e => (e === edgeLineParser.getNodeFrom())) || !nodeIDs.some(e => (e === edgeLineParser.getNodeTo()))) {
                    let message = "Line \"" + line + "\"\nOne of the edge nodes is not defined in \".nodes\" sections";
                    isValid = new IsValid(false, message);
                    break;
                }
                return isValid;
            }
            default: {
                break;
            }
        }
        return isValid;
    }
}
