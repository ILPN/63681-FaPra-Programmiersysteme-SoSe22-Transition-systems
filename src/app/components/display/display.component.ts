import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {DisplayService} from '../../services/display.service';
import {Subscription} from 'rxjs';
import {LayoutService} from '../../services/layout.service';
import {SvgService} from '../../services/svg.service';
import {TsModel} from '../../classes/diagram/tsmodel';

@Component({
    selector: 'app-display',
    templateUrl: './display.component.html',
    styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnDestroy {

    @ViewChild('drawingArea') drawingArea: ElementRef<SVGElement> | undefined;

    private _sub: Subscription;
    private _model: TsModel;

    constructor(private _layoutService: LayoutService,
                private _displayService: DisplayService) {
        //um undefined zu vermeiden
        this._model = new TsModel();
        this._sub = this._displayService.model$.subscribe(diagram => {
            this._model = diagram;
            this._layoutService.layout(this._model);
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

}
