import {Element} from './element';

export class TsElement extends Element {

    private _id: string;

    constructor(id: string) {
        super();
        this._id = id;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

}

