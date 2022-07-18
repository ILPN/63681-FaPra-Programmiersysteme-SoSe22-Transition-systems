import {Injectable} from '@angular/core';
import {TSLineType} from "../util/tsline-type";
import {TSValidatorUtil} from "../util/tsvalidator-util";
import {IsValid} from "../util/is-valid";


@Injectable({
    providedIn: 'root'
})
export class ValidatorService {

    tsValidatorUtil;
    nodeIDs = new Array<string>()

    constructor() {
        this.tsValidatorUtil = new TSValidatorUtil();
    }

    validateTS(text: string): IsValid {

        let isValid: IsValid = new IsValid(true, "");

        let currentLineType = TSLineType.UNDEFINED;
        this.nodeIDs = new Array<string>()

        const lines = text.split('\n');

        //Check first line
        isValid= this.tsValidatorUtil.validateTSLine(TSLineType.TYPETS, lines[0], this.nodeIDs);
        if (isValid.valid) {
            currentLineType = TSLineType.TYPETS;
        } else {
            return isValid;
        }

        //Check other lines
        for (let line of lines) {
            line = line.replace(/\s\s+/g, ' ').trim();
            if (line.trim().length > 0) {
                if (line.trim() === ".nodes") {
                    if (currentLineType != TSLineType.TYPETS) {
                        let message = "Section \"" + line + "\" must be placed after line \".type ts\"";
                        isValid = new IsValid(false, message);
                        break;
                    }
                    currentLineType = TSLineType.NODE;
                } else if (line.trim() === ".edges") {
                    if (currentLineType != TSLineType.NODE) {
                        let message = "Section \"" + line + "\" must be placed after section \".nodes\"";
                        isValid = new IsValid(false, message);
                        break;
                    }
                    currentLineType = TSLineType.EDGE;
                } else {
                    isValid= this.tsValidatorUtil.validateTSLine(currentLineType, line, this.nodeIDs);
                    if (isValid.valid == false) {
                        break;
                    }
                }
            }
        }
        return isValid;
    }


    validatePNML(content: string): IsValid {
        let isValid: IsValid = new IsValid(true, "");
        let parser = new DOMParser();
        let doc = parser.parseFromString(content, "application/xml");
        let errorNode = doc.querySelector("parsererror");
        if (errorNode) {
            let message = "File content is not a valid XML";
            isValid = new IsValid(false, message);
            return isValid;
        } else {
            let places = doc.documentElement.getElementsByTagName("place");
            let transitions = doc.documentElement.getElementsByTagName("transition");
            let arcs = doc.documentElement.getElementsByTagName("arc");
            if (places == null || transitions == null || arcs == null) {
                let message = "The file must contain places, transitions and arcs. At least one is missing";
                isValid = new IsValid(false, message);
                return isValid;
            }
            let sources = this.toArray(arcs, "source")
            let targets = this.toArray(arcs, "target")
            let transitionIds = this.toArray(transitions, "id")
            for (let id of transitionIds) {
                if (targets.indexOf(id) < 0) {
                    let message = "The transition " + id + " has no outgoing edge\nThis is not allowed";
                    isValid = new IsValid(false, message);
                    return isValid;
                }
                if (targets.indexOf(id) != targets.lastIndexOf(id)) {
                    let message = "The transition " + id + " has more than one outgoing edge\nOnly one is allowed";
                    isValid = new IsValid(false, message);
                    return isValid;
                }
                if (sources.indexOf(id) < 0) {
                    let message = "The transition " + id + " has no incoming edge\nThis is not allowed";
                    isValid = new IsValid(false, message);
                    return isValid;
                }
                if (sources.indexOf(id) != sources.lastIndexOf(id)) {
                    let message = "The transition " + id + " has more than one incoming edge\nOnly one is allowed";
                    isValid = new IsValid(false, message);
                    return isValid;
                }
            }
        }
        return isValid;

    }

    private toArray(collection: HTMLCollectionOf<Element>, attribut: string): Array<string> {
        let result = new Array<string>();
        for (let index: number = 0; index < collection.length; index++) {
            let elem = collection[index];
            let e = elem.getAttribute(attribut);
            if (e != null) {
                result[index] = e;
            }
        }
        return result;
    }

    private sectionMarkersValid(lines: string[]) {
        return lines.filter(e => e.trim().replace(/\s/g, "") === ".typets").length === 1
            && lines.filter(e => e.trim().replace(/\s/g, "") === ".nodes").length === 1
            && lines.filter(e => e.trim().replace(/\s/g, "") === ".edges").length === 1;
    }
}
