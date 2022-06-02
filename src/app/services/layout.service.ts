import {Injectable} from '@angular/core';
import {TsModel} from '../classes/diagram/tsmodel';

@Injectable({
    providedIn: 'root'
})
export class LayoutService {

    private static readonly OFFSET = 20;
    private static readonly RANGE_X = 800;
    private static readonly RANGE_Y = 300;

    public layout(diagram: TsModel): void {
        diagram.nodes.forEach(el => {
            el.x = Math.floor(Math.random() * LayoutService.RANGE_X) + LayoutService.OFFSET;
            el.y = Math.floor(Math.random() * LayoutService.RANGE_Y) + LayoutService.OFFSET;
        });
    }
}
