import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseControllerComponent } from '../base-controller/base-controller.component';

@Component({
    selector: 'app-barcle-controller',
    templateUrl: './barcle-controller.component.html',
    styleUrls: ['./barcle-controller.component.css']
})
export class BarcleControllerComponent extends BaseControllerComponent {
    @Input() baseRadius: number;
    @Output() baseRadiusChange: EventEmitter<number> = new EventEmitter();

    constructor() { super(); }

    onBaseRadiusChanged(): void {
        this.baseRadiusChange.emit(this.baseRadius);
    }
}
