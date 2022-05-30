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
    private _model: TsModel | undefined;

    constructor(private _layoutService: LayoutService,
                private _svgService: SvgService,
                private _displayService: DisplayService) {

        this._sub  = this._displayService.model$.subscribe(diagram => {
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
        const elements = this._svgService.createSvgElements(this._displayService.model);
        for (const element of elements) {
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
