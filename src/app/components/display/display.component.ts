import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {DisplayService} from '../../services/display.service';
import {Subscription} from 'rxjs';
import {SvgService} from '../../services/svg.service';
import {TsModel} from '../../classes/diagram/tsmodel';
import {TsEdge} from "../../classes/diagram/tsedge";
import {TsNode} from "../../classes/diagram/tsnode";

@Component({
    selector: 'app-display',
    templateUrl: './display.component.html',
    styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnDestroy {

    @ViewChild('drawingArea') drawingArea: ElementRef<SVGElement> | undefined;

    private _sub: Subscription;
    private _model: TsModel;
    private draggedElement: TsNode|TsEdge|undefined;

    constructor(private _displayService: DisplayService) {
        //um undefined zu vermeiden. Geht bestimmt besser!?
        this._model = new TsModel();
        this._sub = this._displayService.model$.subscribe(diagram => {
            this._model = diagram;
            this._model.layoutBySpringEmbedder();
            this.draw();
        });

    }

    ngOnDestroy(): void {
        this._sub.unsubscribe();
    }

    private draw() {
        if (this.drawingArea === undefined) {
            console.debug('drawing area not ready yet')
            return;
        }
        this.clearDrawingArea();
        this.setUpMouseEvents();
        //Das Defs Element enthält den Arrowhead, auf den die Edges referenzieren
        this.drawingArea.nativeElement.appendChild(SvgService.createDefsElement());
        for (const element of this._model.getSvgElements()) {
            this.drawingArea.nativeElement.appendChild(element);
        }
    }

    private clearDrawingArea() {
        const drawingArea = this.drawingArea?.nativeElement;
        if (drawingArea?.childElementCount === undefined) {
            return;
        }

        while (drawingArea.childElementCount > 0) {
            drawingArea.removeChild(drawingArea.lastChild as ChildNode);
        }
    }

    private setUpMouseEvents() {
        const drawingArea = this.drawingArea?.nativeElement;
        if (drawingArea === undefined) {
            return;
        }
        drawingArea.onmousedown = (event) => {
            this.processMouseDown(event);
        };
        drawingArea.onmouseup = (event) => {
            this.processMouseUp(event);
        };
        drawingArea.onmousemove = (event) => {
            this.processMouseMoving(event);
        }
        drawingArea.onmouseleave = (event) => {
            this.processMouseLeave(event);
        }
    }

    private processMouseDown(event: MouseEvent) {
        this.draggedElement = this._model.getElementForMouseEvent(event);
    }

    private processMouseUp(event: MouseEvent) {
        this._model.removeAllDragedMarker()
        this.draggedElement = undefined;
    }

    private processMouseMoving(event: MouseEvent) {
        if(this.draggedElement){
            this.draggedElement.setPosition(event.offsetX, event.offsetY)
        }
    }

    private processMouseLeave(event: MouseEvent) {

    }
}
