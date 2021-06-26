import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseControllerComponent } from '../base-controller/base-controller.component';

@Component({
    selector: 'app-bar-controller',
    templateUrl: './bar-controller.component.html',
    styleUrls: ['./bar-controller.component.css']
})
export class BarControllerComponent extends BaseControllerComponent {
    @Input() barCapSize: number;
    @Input() barSize: number;
    @Input() barSpacing: number;
    @Output() barCapSizeChange: EventEmitter<number> = new EventEmitter();
    @Output() barSizeChange: EventEmitter<number> = new EventEmitter();
    @Output() barSpacingChange: EventEmitter<number> = new EventEmitter();

   constructor() { super(); }

}
