import {Injectable} from '@angular/core';
import {TsModel} from "../classes/diagram/tsmodel";
import {TSLineType} from "../util/tsline-type";
import {TSParserUtil} from "../util/tsparser-util";

@Injectable({
    providedIn: 'root'
})
export class ParserService {

    constructor() {
    }

    parse(text: string): TsModel {
        const lines = text.split('\n');

        const tsModel = new TsModel();
        let currentLineType = TSLineType.UNDEFINED;

        lines.forEach(line => {
            line = line.replace(/\s\s+/g, ' ').trim();
            if (line.length > 0) {
                if (line.trim() === ".nodes") {
                    currentLineType = TSLineType.NODE;
                } else if (line.trim() === ".edges") {
                    currentLineType = TSLineType.EDGE;
                } else {
                    this.parseTSLine(line, currentLineType, tsModel);
                }
            }
        });
        return tsModel;
    }

    private parseTSLine(line: string, type: TSLineType, tsModel: TsModel) {
        let parserUtil = new TSParserUtil();
        switch (type) {
            case TSLineType.NODE: {
                tsModel.addNode(parserUtil.parseNode(line.trim()));
                break;
            }
            case TSLineType.EDGE: {
                tsModel.addEdge(parserUtil.parseEdge(line.trim(), tsModel));
                break;
            }
            default: {
                break;
            }
        }
    }

}
