import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphPropertiesButtonComponent } from './graph-properties-button.component';

describe('GraphPropertiesButtonComponent', () => {
  let component: GraphPropertiesButtonComponent;
  let fixture: ComponentFixture<GraphPropertiesButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphPropertiesButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphPropertiesButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
