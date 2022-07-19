import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ParserService} from './services/parser.service';
import {DisplayService} from './services/display.service';
import {TsModel} from "./classes/diagram/tsmodel";
import {ExportService} from "./services/export.service";
import {ValidatorService} from "./services/validator.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, AfterViewInit {

    public textareaFc: FormControl;
    private model: TsModel;
    files: any[] = [];

    constructor(private _parserService: ParserService,
                private _displayService: DisplayService, private _exportService: ExportService, private _validatorService: ValidatorService) {
        this.textareaFc = new FormControl();
        this.model = new TsModel();
        this.textareaFc.setValue(AppComponent.defaultText());
    }

    ngOnDestroy(): void {
    }

    ngAfterViewInit() {
        this.refreshGraph();
    }

    private processSourceChange(newSource: string) {
        this.model = this._parserService.parse(newSource.trim());
        this._displayService.display(this.model);
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

    private async processFile(file: File) {
        let content = await file.text();
        let isValid = this._validatorService.validateTS(content);
        if (isValid) {
            this.textareaFc.setValue(this.getTSContentToDisplay(content));
            this.processSourceChange(content);
        } else {
            alert("The file your are trying to upload is not valid\nPlease check the file!")
        }
    }

    private getTSContentToDisplay(text: string): string {
        const lines = text.trim().split('\n');
        let result = ".type ts\n";
        let sectionMarker = "";
        lines.forEach(line => {
            if (line.trimEnd().length > 0) {
                if (line.trim() === ".nodes") {
                    sectionMarker = "nodes"
                    result = result + line + "\n";
                } else if (line.trim() === ".edges") {
                    sectionMarker = "edges"
                    result = result + line + "\n";
                } else {
                    switch (sectionMarker) {
                        case "nodes": {
                            let elems = line.split(" ");
                            result = result + elems[0] + " " + elems[1] + "\n"
                            break;
                        }
                        case "edges": {
                            result = result + line + "\n";
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                }
            }
        });
        return result;
    }

    refreshGraph() {
        if (this.textareaFc.value != null) {
            let content = this.textareaFc.value.trim();
            let isValid = this._validatorService.validateTS(content);
            if (isValid) {
                this.processSourceChange(content)
            } else {
                alert("Your input is not valid\nPlease check!")
            }
        } else {
            alert("Your input is empty\nThis is not allowed!")
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

    highlightProperties() {
        const properties = this.model.getGraphProperties();
        properties.highlightCycles()
        properties.highlightDeadlocks()

        //properties.mortalTransitions.forEach(m => m.highlightMortalTransition());
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
e6 t6 1 n2 n1
`;
    }


}

