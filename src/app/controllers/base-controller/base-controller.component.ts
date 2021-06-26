import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    template: '',
})
export abstract class BaseControllerComponent {
    @Input() scale: number = 1;
    @Input() oomph: number = 1;
    @Output() scaleChange: EventEmitter<number> = new EventEmitter();
    @Output() oomphChange: EventEmitter<number> = new EventEmitter();
    @Output() remove: EventEmitter<void> = new EventEmitter();

    onScaleChanged() {
        this.scaleChange.emit(this.scale);
    }

    onOomphChanged() {
        this.oomphChange.emit(this.oomph);
    }

    onRemove(): void {
        this.remove.emit();
    }
}
