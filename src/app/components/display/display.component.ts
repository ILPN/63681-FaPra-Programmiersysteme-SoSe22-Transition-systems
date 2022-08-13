import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {DisplayService} from '../../services/display.service';
import {Subscription} from 'rxjs';
import {SvgService} from '../../services/svg.service';
import {TsModel} from '../../classes/diagram/tsmodel';
import {TsEdge} from "../../classes/diagram/tsedge";
import {TsNode} from "../../classes/diagram/tsnode";
import {Vector} from "../../classes/spring_embedder/models/vector";

@Component({
    selector: 'app-display',
    templateUrl: './display.component.html',
    styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnDestroy {

    // Repräsentiert die Zeichenebene des Graphen in Form eines Haupt-SVG-Elements
    @ViewChild('drawingArea') drawingArea: ElementRef<SVGElement> | undefined;

    private _sub: Subscription;
    private _model!: TsModel;
    private draggedElement: TsNode | TsEdge | undefined;
    private springEmbedderModus: Boolean;
    private mouseMoveReferencePoint: Vector | undefined;

    constructor(private _displayService: DisplayService) {
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
        if (this.draggedElement?.isNode() && this.springEmbedderModus) {
            let node: TsNode = <TsNode>this.draggedElement;
            //TODO this.mouseMoveReferencePoint = node.position; geht anscheinend nicht weil mousedown-event während der ganzen Maus-Bewegung erzeugt wird
        }
    }

    private processMouseUp() {
        this._model.removeAllDragedMarker()
        if (this.draggedElement?.isNode() && this.springEmbedderModus) {
            let node: TsNode = <TsNode>this.draggedElement;
            this._model.refreshSpringEmbedderLayout(node.id);
            //this._model.layoutBySpringEmbedder(false);
        }
        this.draggedElement = undefined;
        this.mouseMoveReferencePoint = undefined;
    }

    private processMouseMoving(event: MouseEvent) {
        if (this.draggedElement) {
            //TODO Bei einer flüssigen Spring-Embedder-Darstellung sollte hier auch per Spring-Embedder gerendert werden
            if (this.draggedElement?.isNode() && this.springEmbedderModus) {
                let node: TsNode = <TsNode>this.draggedElement;
                let mousePosition: Vector = new Vector(event.offsetX, event.offsetY);
                if (this.mouseMoveReferencePoint) {
                    let distToRefPoint = mousePosition.distanceTo(this.mouseMoveReferencePoint);
                    console.log("distToRefPoint: " + distToRefPoint);
                    //TODO choose appropriate value
                    if (distToRefPoint > 3) {
                        //TODO Der bewegte Knoten sollte durch diesen Aufruf nicht gerendert werden, da er fixiert wird.
                        /*
                        TODO Hier sollte die Anzahl an Iterationen kleiner sein als bei der initialen Anzeige - z.B. 10.
                         Dadurch wird das Layout dynamischer.
                         */
                        this._model.refreshSpringEmbedderLayout(node.id);
                        this.mouseMoveReferencePoint = mousePosition;
                    }
                } else {
                    this.mouseMoveReferencePoint = mousePosition;
                }
            }
            this.draggedElement.setPositionAndUpdateView(event.offsetX, event.offsetY)
        }
    }

    toggleSpringEmbedderModus() {
        this.springEmbedderModus = !this.springEmbedderModus;
    }
}
