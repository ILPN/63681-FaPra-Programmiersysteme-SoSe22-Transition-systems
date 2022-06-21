import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ValidatorService {

    constructor() {
    }

    validateTS(text: string): boolean {
        let isValid = true;
        let fileFormatLineReached = 1;
        let nodesSectionReached = 2;
        let edgeSectionReached = 3;
        let sectionMarker = "";
        let currentMarker = 0;

        const lines = text.split('\n');
        lines.every(line => {
            if (line.trimEnd().length > 0) {
                if (line.trim().replace(/\s/g, "") === ".typets") {
                    if(currentMarker != 0){
                        isValid = false;
                        return isValid;
                    }
                    currentMarker = fileFormatLineReached;
                }else if (line.trimEnd() === ".nodes") {
                    if(currentMarker != fileFormatLineReached){
                        isValid = false;
                        return isValid;
                    }
                    currentMarker = nodesSectionReached;
                    sectionMarker = "nodes"
                } else if (line.trimEnd() === ".edges") {
                    if(currentMarker != nodesSectionReached){
                        isValid = false;
                        return isValid;
                    }
                    currentMarker = edgeSectionReached;
                    sectionMarker = "edges"
                } else {
                    switch (sectionMarker) {
                        case "nodes": {
                            let elems = line.split(" ");
                            if(elems.length != 2){
                                isValid = false;
                                break;
                            }
                            isValid = elems[1].trim().startsWith("(") && elems[1].trim().endsWith(")")
                            break;
                        }
                        case "edges": {
                            let elems = line.split(" ");
                            if(elems.length != 5){
                                isValid = false;
                                break;
                            }
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
