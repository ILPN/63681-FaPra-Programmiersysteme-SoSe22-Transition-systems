import {Injectable} from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class ValidatorService {

    constructor() {
    }

    validateTS(text: string): boolean {
        let isValid: boolean = true;
        let fileFormatLineReached = 1;
        let nodesSectionReached = 2;
        let edgeSectionReached = 3;
        let sectionMarker = "";
        let currentMarker = 0;
        let nodeIDs = new Array<string>();

        const lines = text.split('\n');
        lines.every(line => {
            if (line.trim().length > 0) {
                if (line.trim().replace(/\s/g, "") === ".typets") {
                    if (currentMarker != 0) {
                        isValid = false;
                        return isValid;
                    }
                    currentMarker = fileFormatLineReached;
                } else if (line.trim() === ".nodes") {
                    if (currentMarker != fileFormatLineReached) {
                        isValid = false;
                        return isValid;
                    }
                    currentMarker = nodesSectionReached;
                    sectionMarker = "nodes"
                } else if (line.trim() === ".edges") {
                    if (currentMarker != nodesSectionReached) {
                        isValid = false;
                        return isValid;
                    }
                    currentMarker = edgeSectionReached;
                    sectionMarker = "edges"
                } else {
                    switch (sectionMarker) {
                        case "nodes": {
                            let elems = line.trim().split(" ");
                            nodeIDs.push(elems[0]);
                            if (elems.length != 2 && elems.length != 3) {
                                isValid = false;
                                break;
                            }
                            break;
                        }
                        case "edges": {
                            let elems = line.trim().split(" ");
                            if (elems.length != 5) {
                                isValid = false;
                                break;
                            }
                            isValid = nodeIDs.some(e => (e === elems[3])) && nodeIDs.some(e => (e === elems[4]));
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                    return isValid;
                }
            }
            return isValid;
        });
        return isValid;
    }
}
