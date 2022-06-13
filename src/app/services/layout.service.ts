import {Injectable} from '@angular/core';
import {TsModel} from '../classes/diagram/tsmodel';
import {Vector} from "../classes/spring_embedder/models/vector";


@Injectable({
    providedIn: 'root'
})
export class LayoutService {

    public layout(diagram: TsModel): void {
        diagram.nodes.forEach(el => {
            // need to be done by spring embedder
            el.position = Vector.random();
        });
    }
}
