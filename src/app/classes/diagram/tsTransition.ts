export class TsTransition {

    private _label: string;

    constructor(label: string) {
        this._label = label;
    }

    get label(): string {
        return this._label;
    }
}
