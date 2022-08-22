import {Injectable} from '@angular/core';
import {FRSpringEmbedder1Service} from "../layout/frspring-embedder1.service";
import {LayoutController} from "./layout-controller";

@Injectable({
    providedIn: 'root'
})
export class SpringEmbedderControllerService implements LayoutController {

    constructor(private _springEmbedder1Service: FRSpringEmbedder1Service) {
        console.log("SpringEmbedderControllerService constructor ...");
    }

    public drawInitialGraph(): void {
        this._springEmbedder1Service.initPositions();
        this._springEmbedder1Service.setInitLayoutProperties();
        this._springEmbedder1Service.layoutGraph();
        this._springEmbedder1Service.setNodeMoveLayoutProperties();
    }

    public moveNode(nodeId: string): void {
        this._springEmbedder1Service.layoutGraph(nodeId);
    }

    public redrawGraph(): void {
        this._springEmbedder1Service.setInitLayoutProperties();
        this._springEmbedder1Service.layoutGraph();
        this._springEmbedder1Service.setNodeMoveLayoutProperties();
    }

}
