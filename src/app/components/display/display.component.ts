import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {DisplayService} from '../../services/display.service';
import {Subscription} from 'rxjs';
import {SvgService} from '../../services/svg.service';
import {TsModel} from '../../classes/diagram/tsmodel';
import {TsEdge} from "../../classes/diagram/tsedge";
import {TsNode} from "../../classes/diagram/tsnode";
import {Vector} from "../../classes/diagram/vector/vector";
import {SpringEmbedderControllerService} from "../../classes/graph/controller/spring-embedder-controller.service";

@Component({
    selector: 'app-display',
    templateUrl: './display.component.html',
    styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnDestroy {

    public static readonly DRAWING_AREA_ID: string = "drawingAreaSvg";

    public static readonly DRAWING_AREA_WIDTH_PX_FALLBACK_VALUE: number = window.innerWidth/1.1;

    public static readonly DRAWING_AREA_HEIGHT_PX_FALLBACK_VALUE: number = 400;

    // Repräsentiert die Zeichenebene des Graphen in Form eines Haupt-SVG-Elements
    @ViewChild('drawingArea') drawingArea: ElementRef<SVGElement> | undefined;

    private _sub: Subscription;
    private _model!: TsModel;
    private draggedElement: TsNode | TsEdge | undefined;
    private springEmbedderModus: Boolean;
    private mouseMoveReferencePoint: Vector | undefined;

    constructor(private _displayService: DisplayService, private _springEmbedderControllerService: SpringEmbedderControllerService) {
        this.springEmbedderModus = true;
        this._sub = this._displayService.model$.subscribe(model => {
            this._model = model;
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
        drawingArea.onmousedown = () => {
            this.processMouseDown();
        };
        drawingArea.onmouseup = () => {
            this.processMouseUp();
        };
        drawingArea.onmousemove = (event) => {
            this.processMouseMoving(event);
        }

    }

    private processMouseDown() {
        this.draggedElement = this._model.getDraggedElement();
    }

    private processMouseUp() {
        this._model.removeAllDragedMarker()
        if (this.draggedElement?.isNode() && this.springEmbedderModus) {
            let node: TsNode = <TsNode>this.draggedElement;
            this._springEmbedderControllerService.moveNode(node.id);
        }
        this.draggedElement = undefined;
        this.mouseMoveReferencePoint = undefined;
    }

    private processMouseMoving(event: MouseEvent) {
        if (this.draggedElement) {
            if (this.draggedElement?.isNode() && this.springEmbedderModus) {
                let node: TsNode = <TsNode>this.draggedElement;
                this._springEmbedderControllerService.moveNode(node.id);
            }
            this.draggedElement.setPositionAndUpdateView(event.offsetX, event.offsetY)
        }
    }

    toggleSpringEmbedderModus() {
        this.springEmbedderModus = !this.springEmbedderModus;
    }
}
