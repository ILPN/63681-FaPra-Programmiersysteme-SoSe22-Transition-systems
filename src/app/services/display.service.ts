import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {TsModel} from '../classes/diagram/tsmodel';

@Injectable({
    providedIn: 'root'
})
export class DisplayService implements OnDestroy {

    private _model$: BehaviorSubject<TsModel>;

    constructor() {
        this._model$ = new BehaviorSubject<TsModel>(new TsModel());
    }

    ngOnDestroy(): void {
        this._model$.complete();
    }

    public get diagram$(): Observable<TsModel> {
        return this._model$.asObservable();
    }

    public get diagram(): TsModel {
        return this._model$.getValue();
    }

    public display(net: TsModel) {
        this._model$.next(net);
    }

}
