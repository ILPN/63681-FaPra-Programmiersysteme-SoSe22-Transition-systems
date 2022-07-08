import {Injectable} from '@angular/core';
import {TSLineType} from "../util/tsline-type";
import {TSValidatorUtil} from "../util/tsvalidator-util";


@Injectable({
    providedIn: 'root'
})
export class ValidatorService {

    tsValidatorUtil;
    nodeIDs = new Array<string>()

    constructor() {
        this.tsValidatorUtil = new TSValidatorUtil();
    }

    validateTS(text: string): boolean {
        let isValid: boolean = true;
        let currentLineType = TSLineType.UNDEFINED;
        this.nodeIDs = new Array<string>()

        const lines = text.split('\n');

        //Check first line
        if (this.tsValidatorUtil.validateTSLine(TSLineType.TYPETS, lines[0], this.nodeIDs)) {
            currentLineType = TSLineType.TYPETS;
        } else {
            isValid = false;
            return isValid;
        }

        //Check other lines
        for (let line of lines) {
            line = line.replace(/\s\s+/g, ' ').trim();
            if (line.trim().length > 0) {
                if (line.trim() === ".nodes") {
                    if (currentLineType != TSLineType.TYPETS) {
                        isValid = false;
                        break;
                    }
                    currentLineType = TSLineType.NODE;
                } else if (line.trim() === ".edges") {
                    if (currentLineType != TSLineType.NODE) {
                        isValid = false;
                        break;
                    }
                    currentLineType = TSLineType.EDGE;
                } else {
                    if (this.tsValidatorUtil.validateTSLine(currentLineType, line, this.nodeIDs) == false) {
                        isValid = false;
                        break;
                    }
                }
            }
        }
        return isValid;
    }


    validatePNML(content: string): boolean {
        let isValid: boolean = true;
        let parser = new DOMParser();
        let doc = parser.parseFromString(content, "application/xml");
        let errorNode = doc.querySelector("parsererror");
        if (errorNode) {
            isValid = false;
            return isValid;
        } else {
            let places = doc.documentElement.getElementsByTagName("place");
            let transitions = doc.documentElement.getElementsByTagName("transition");
            let arcs = doc.documentElement.getElementsByTagName("arc");
            if (places == null || transitions == null || arcs == null) {
                isValid = false;
                return isValid;
            }
            let sources = this.toArray(arcs, "source")
            let targets = this.toArray(arcs, "target")
            let transitionIds = this.toArray(transitions, "id")
            for (let id of transitionIds) {
                if (targets.indexOf(id) < 0 || targets.indexOf(id) != targets.lastIndexOf(id)) {
                    isValid = false;
                    return isValid;
                }
                if (sources.indexOf(id) < 0 || sources.indexOf(id) != sources.lastIndexOf(id)) {
                    isValid = false;
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
