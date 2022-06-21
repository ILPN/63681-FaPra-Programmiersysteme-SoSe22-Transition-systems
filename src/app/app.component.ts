import {Component, OnDestroy} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ParserService} from './services/parser.service';
import {DisplayService} from './services/display.service';
import {debounceTime, Subscription} from 'rxjs';
import {TsModel} from "./classes/diagram/tsmodel";
import {ExportService} from "./services/export.service";
import {ValidatorService} from "./services/validator.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

    public textareaFc: FormControl;
    private model: TsModel;
    private _sub: Subscription;

    constructor(private _parserService: ParserService,
                private _displayService: DisplayService, private _exportService: ExportService, private _validatorService:ValidatorService) {
        this.textareaFc = new FormControl();
        this.model = new TsModel();
        this._sub = this.textareaFc.valueChanges.pipe(debounceTime(400)).subscribe(val => this.processSourceChange(val));
        this.textareaFc.setValue(AppComponent.defaultText());
    }


    ngOnDestroy(): void {
        this._sub.unsubscribe();
    }

    private processSourceChange(newSource: string) {
        this.model = this._parserService.parse(newSource);
        this._displayService.display(this.model);
    }

    async onFileInput(event: Event) {
        const element = event.currentTarget as HTMLInputElement;
        let fileList: FileList | null = element.files;
        if (fileList) {
            let file = fileList[0];
            let result = await file.text();
            let isValid = this._validatorService.validateTS(result);
            if(isValid){
                this.textareaFc.setValue(result.trim())
            }else{
                this.textareaFc.setValue("")
                this.textareaFc.setValue("File is not valid")
            }

        }
    }

    saveTSFile() {
        let data = new Blob([this._exportService.exportTS(this.model)], {type: 'text/plain'});
        let url = window.URL.createObjectURL(data);
        let a = document.createElement('a');
        document.body.appendChild(a);

        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = 'transition-system.ts';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();

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
e1 t1 1 n1 n2
e2 t2 1 n2 n3
e3 t3 1 n3 n4
e4 t4 1 n3 n5
e5 t5 1 n4 n2
`;
    }

    highlightProperties() {
        const properties = this.model.getGraphProperties();
        properties.cycleElements.forEach(e => e.highlightCycleElement());
        properties.deadlocks.forEach(d => d.highlightDeadlock());
        properties.mortalTransitions.forEach(m => m.highlightMortalTransition());
    }
}
