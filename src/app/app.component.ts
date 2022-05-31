import {Component, OnDestroy} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ParserService} from './services/parser.service';
import {DisplayService} from './services/display.service';
import {debounceTime, Subscription} from 'rxjs';
import {TsModel} from "./classes/diagram/tsmodel";

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
                private _displayService: DisplayService) {
        this.textareaFc = new FormControl();
        this.model = new TsModel();
        this._sub = this.textareaFc.valueChanges.pipe(debounceTime(400)).subscribe(val => this.processSourceChange(val));
        this.textareaFc.setValue(this.defaultText());
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
            //TODO result should be processed later here (validation for .ts files and conversion for .pnml files)
            this.textareaFc.setValue(result)
        }
    }

    saveTSFile() {
        let data = new Blob([this.textareaFc.value], {type: 'text/plain'});
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

    private defaultText() {
        return `.type ts
.nodes
n1 11
n2 12
n3 13
n4 14
n5 15
n6 16
n7 17
n8 18
n9 19
n10 20
.edges
e1 C 1 n1 n2
e2 C 1 n2 n4
e3 C 1 n4 n6
e4 C 1 n6 n8
e5 C 1 n3 n5
e6 C 1 n5 n7
e7 C 1 n7 n9
e8 D 1 n2 n3
e9 D 1 n4 n5
e10 D 1 n6 n7
e11 D 1 n8 n9
e12 D 1 n9 n10
`;
    }
}
