import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ParserService} from './services/parser.service';
import {DisplayService} from './services/display.service';
import {TsModel} from "./classes/diagram/tsmodel";
import {ExportService} from "./services/export.service";
import {ValidatorService} from "./services/validator.service";
import {PNMLService} from './services/pnml.service';
import {TSParserUtil} from "./util/tsparser-util";
import {FileType} from "./util/file-type";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

    public textareaFc: FormControl;
    private model!: TsModel;
    files: any[] = [];
    tsParserUtil: TSParserUtil;

    constructor(private _parserService: ParserService,
                private _displayService: DisplayService,
                private _exportService: ExportService,
                private _validatorService: ValidatorService,
                private _pnmlImporter: PNMLService
                ) {
        this.textareaFc = new FormControl();
        this.model = new TsModel();
        this.tsParserUtil = new TSParserUtil();
        let tsText = this.getLastState();
        if (tsText != null && !(tsText === '') && this._validatorService.validateTS(tsText).valid) {
           this.textareaFc.setValue(this.tsParserUtil.getTSContentToDisplay(tsText));
        } else {
            this.textareaFc.setValue(AppComponent.defaultText());
        }
    }


    ngAfterViewInit() {
        this.refreshGraph();
    }

    resetToDefault() {
        let content = AppComponent.defaultText().trim() + "\n";
        this.textareaFc.setValue(content);
        this.processSourceChange(content, false)
    }

    refreshGraph() {
        if (this.textareaFc.value != null && this.textareaFc.value.trim() != '') {
            let content = this.textareaFc.value.trim();
            let isValid = this._validatorService.validateTS(content);
            if (isValid.valid) {
                this.processSourceChange(content, false)
            } else {
                alert("Your input is not valid\nMessage:\n" + isValid.message)
            }
        } else {
            alert("Your input is empty!\nPlease click on \"Default\" to get a default input")
        }

    }

    showHideProperties() {
        this.model.showHideProperties();
    }

    async onFileDropped($event: any) {
        let file = $event[0];
        await this.processFile(file)
    }

    async onFileInput(event: Event) {
        const element = event.currentTarget as HTMLInputElement;
        let fileList: FileList | null = element.files;
        if (fileList) {
            let file = fileList[0];
            await this.processFile(file)
        }
    }

    private processSourceChange(newSource: string, fromFile: boolean) {
        this.model = this._parserService.parse(newSource.trim());
        if(!fromFile || !this.model.nodePositionsOK)
            this.model.layoutBySpringEmbedder(true);
        this._displayService.display(this.model);
        this.saveCurrentState();
    }

    private async processFile(file: File) {
        if (this.getFileType(file) == FileType.PNML) {
            await this.processPNMLFile(file);
        } else {
            await this.processTSFile(file);
        }
    }

    private async processTSFile(file: File) {
        let content = await file.text();
        let isValid = this._validatorService.validateTS(content);
        if (isValid.valid) {
            this.textareaFc.setValue(this.tsParserUtil.getTSContentToDisplay(content));
            this.processSourceChange(content, true);
        } else {
            alert("The file your are trying to upload is not valid\nMessage:\n" + isValid.message)
        }
    }

    private async processPNMLFile(file: File) {
        let content = await file.text();
        let isValid = this._validatorService.validatePNML(content);
        if (isValid.valid) {
            this.model = this._pnmlImporter.import(content);
            //convert in .ts Format for display
            let tsText = this._exportService.exportTS(this.model);
            this.textareaFc.setValue(this.tsParserUtil.getTSContentToDisplay(tsText));
            this.processSourceChange(tsText, true);
        } else {
            alert("The file your are trying to upload is not valid\nMessage:\n" + isValid.message)
        }
    }

    private saveCurrentState() {
        let tsText = this._exportService.exportTS(this.model);
        localStorage.removeItem('tsText');
        localStorage.setItem('tsText', tsText);
    }

    private getLastState(): string | null {
        return localStorage.getItem('tsText');
    }

    private getFileType(file: File): FileType {
        if (file.name.toUpperCase().endsWith("PNML")) {
            return FileType.PNML;
        } else {
            return FileType.TS;
        }
    }

    private static defaultText() {
        return `.type ts
.nodes
n1 (10000)
n2 (01000)
n3 (00100)
n4 (00001)
n5 (00010)
.edges
n1 n2 t1
n2 n3 t2
n3 n4 t4
n3 n5 t5
n4 n2 t6
n2 n1 t7
`;
    }


}

