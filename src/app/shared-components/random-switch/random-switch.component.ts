import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
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
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RandomSwitchComponent {
    @Input() isRandom?: boolean;

    @Output() isRandomChange: EventEmitter<boolean> = new EventEmitter();
}
