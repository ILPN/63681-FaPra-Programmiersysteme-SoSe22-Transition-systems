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
        lines.every(line => {
            line = line.replace(/\s\s+/g, ' ').trim();
            if (line.trim().length > 0) {
                if (line.trim() === ".nodes") {
                    if (currentLineType != TSLineType.TYPETS) {
                        isValid = false;
                        return isValid;
                    }
                    currentLineType = TSLineType.NODE;
                } else if (line.trim() === ".edges") {
                    if (currentLineType != TSLineType.NODE) {
                        isValid = false;
                        return isValid;
                    }
                    currentLineType = TSLineType.EDGE;
                } else {
                    isValid = this.tsValidatorUtil.validateTSLine(currentLineType, line, this.nodeIDs)
                    return isValid;
                }
            }
            return isValid;
        });
        return isValid;
    }

}
