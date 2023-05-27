import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

@Component({
    selector: 'app-random-switch',
    standalone: true,
    imports: [NgIf, FormsModule, NzSwitchModule],
    template: `
        <nz-switch
            [ngModel]="isRandom"
            (ngModelChange)="isRandom = $event; isRandomChange.emit(isRandom)"
        >
        </nz-switch>
    `,
})
export class RandomSwitchComponent {
    @Input() isRandom?: boolean;

    @Output() isRandomChange: EventEmitter<boolean> = new EventEmitter();
}
