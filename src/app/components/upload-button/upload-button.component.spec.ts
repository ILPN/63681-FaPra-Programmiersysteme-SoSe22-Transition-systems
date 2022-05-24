import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadButtonComponent } from './upload-button.component';
import {TemplateButtonComponent} from "../template-button/template-button.component";

describe('UploadButtonComponent', () => {
    let component: TemplateButtonComponent;
    let fixture: ComponentFixture<TemplateButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TemplateButtonComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TemplateButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
