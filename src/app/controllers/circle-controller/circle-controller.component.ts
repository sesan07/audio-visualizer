import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseControllerComponent } from '../base-controller/base-controller.component';

@Component({
    selector: 'app-circle-controller',
    templateUrl: './circle-controller.component.html',
    styleUrls: ['./circle-controller.component.css']
})
export class CircleControllerComponent extends BaseControllerComponent {
    @Input() baseRadius: number;
    @Input() sampleRadius: number;
    @Output() baseRadiusChange: EventEmitter<number> = new EventEmitter();
    @Output() sampleRadiusChange: EventEmitter<number> = new EventEmitter();

    constructor() { super(); }

    onBaseRadiusChanged(): void {
        this.baseRadiusChange.emit(this.baseRadius);
    }

    onSampleRadiusChanged(): void {
        this.sampleRadiusChange.emit(this.sampleRadius);
    }

}
