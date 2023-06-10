import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { ColorEvent, RGBA } from 'ngx-color';
import { ColorSketchModule } from 'ngx-color/sketch';

@Component({
    selector: 'app-color-picker',
    standalone: true,
    imports: [NgStyle, NzPopoverModule, NzButtonModule, ColorSketchModule],
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPickerComponent {
    @Input() color: RGBA = { r: 255, g: 255, b: 255, a: 1 };
    @Output() colorChange: EventEmitter<RGBA> = new EventEmitter();

    isOpen: boolean = false;
    tempColor: RGBA = this.color;

    onClose(isOk: boolean): void {
        if (isOk) {
            this.color = this.tempColor;
            this.colorChange.emit(this.color);
        } else {
            this.tempColor = this.color;
        }
        this.isOpen = false;
    }

    onColorChange(event: ColorEvent): void {
        this.tempColor = event.color.rgb;
    }
}
