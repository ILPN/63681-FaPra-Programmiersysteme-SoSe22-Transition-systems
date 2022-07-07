import {Component, Input} from '@angular/core';
import {DisplayService} from "../../services/display.service";
import {ExportService} from "../../services/export.service";

@Component({
  selector: 'app-download-button',
  templateUrl: './download-button.component.html',
  styleUrls: ['./download-button.component.scss']
})
export class DownloadButtonComponent {

    @Input() buttonText: string | undefined;
    @Input() buttonIcon: string | undefined;

    constructor(private _displayService: DisplayService, private _exportService: ExportService) {
    }

    prevent(e: Event) {
        e.preventDefault();
        e.stopPropagation();
    }

    hoverStart(e: MouseEvent) {
        this.prevent(e);
        const target = (e.target as HTMLElement);
        target.classList.add('mouse-hover');
    }

    hoverEnd(e: MouseEvent) {
        this.prevent(e);
        const target = (e.target as HTMLElement);
        target.classList.remove('mouse-hover');
    }

    saveTSFile() {
        let model = this._displayService.model;
        let data = new Blob([this._exportService.exportTS(model)], {type: 'text/plain'});
        this.saveBlob(data, 'transition-system.ts');
    }

    savePNMLFile() {
        let model = this._displayService.model;
        let data = new Blob([this._exportService.exportPNML(model)], {type: 'text/xml'});
        this.saveBlob(data, 'transition-system.pnml');
    }

    private saveBlob(data: Blob, fileName: string) {
        let url = window.URL.createObjectURL(data);
        let a = document.createElement('a');
        document.body.appendChild(a);

        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }
}
