import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {
    @Input() color: string;
    @Output() colorChange: EventEmitter<string> = new EventEmitter();

    isOpen: boolean = false;
    tempColor: string;

    ngOnInit(): void {
        this.tempColor = this.color;
    }

    onClose(isOk: boolean): void {
        if (isOk) {
            this.color = this.tempColor;
            this.colorChange.emit(this.color);
        } else {
            this.tempColor = this.color;
        }
        this.isOpen = false;
    }
}
