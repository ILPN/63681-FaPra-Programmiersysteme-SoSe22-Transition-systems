import {TsElement} from "./tselement";

export class TsNode extends TsElement {

    private readonly _label: string;

    constructor(id: string, label: string) {
        super(id);
        this._label = label;
    }

    get label(): string {
        return this._label;
    }


}
