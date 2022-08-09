import {Vector} from "../spring_embedder/models/vector";

export class TsTransition {
    get position(): Vector {
        return this._position;
    }

    set position(value: Vector) {
        this._position = value;
    }

    private _label: string;
    private _position: Vector;

    constructor(label: string, position: Vector = new Vector(0,0)) {
        this._label = label;
        this._position = position
    }

    get label(): string {
        return this._label;
    }


}
