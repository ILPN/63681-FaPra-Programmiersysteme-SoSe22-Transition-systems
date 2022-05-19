import {Element} from './element';

export class TsElement extends Element {

    private _id: string;
    protected readonly _label: string;

    constructor(id: string, label: string) {
        super();
        this._id = id;
        this._label = label;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get label(): string {
        return this._label;
    }
}

