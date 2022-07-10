export class IsValid {
    private _valid: boolean = true;
    private _message: string = "";


    constructor(valid: boolean, message: string) {
        this._valid = valid;
        this._message = message;
    }

    get valid(): boolean {
        return this._valid;
    }

    set valid(value: boolean) {
        this._valid = value;
    }

    get message(): string {
        return this._message;
    }

    set message(value: string) {
        this._message = value;
    }
}
