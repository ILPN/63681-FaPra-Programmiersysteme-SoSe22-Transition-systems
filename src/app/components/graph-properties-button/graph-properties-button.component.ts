import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-graph-properties-button',
  templateUrl: './graph-properties-button.component.html',
  styleUrls: ['./graph-properties-button.component.scss']
})
export class GraphPropertiesButtonComponent {

    @Input() buttonText: string | undefined;
    @Input() buttonIcon: string | undefined;
    @Input() buttonLabel1: string | undefined;
    @Input() buttonLabel2: string | undefined;

  constructor() { }

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

}
