import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ControlLineComponent } from '../control-line/control-line.component';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { FormsModule } from '@angular/forms';
import { RandomSwitchComponent } from '../random-switch/random-switch.component';

@Component({
    selector: 'app-control-line-slider',
    standalone: true,
    imports: [
        NgIf,
        FormsModule,
        ControlLineComponent,
        RandomSwitchComponent,
        NzInputNumberModule,
        NzSliderModule,
        NzSwitchModule,
    ],
    templateUrl: './control-line-slider.component.html',
    styleUrls: ['./control-line-slider.component.scss'],
})
export class ControlLineSliderComponent {
    @Input() name: string = '';
    @Input() description: string = '';
    @Input() value: number = 0;
    @Input() step: number = 0.1;
    @Input() min: number = 0;
    @Input() max: number = 1;
    @Input() showRandomize?: boolean;
    @Input() randomize?: boolean;

    @Output() valueChange: EventEmitter<number> = new EventEmitter();
    @Output() randomizeChange: EventEmitter<boolean> = new EventEmitter();
}
