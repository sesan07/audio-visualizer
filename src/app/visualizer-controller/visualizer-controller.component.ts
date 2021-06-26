import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IVisualizerConfig, VisualizerType } from '../visualizer/visualizer.types';

@Component({
    selector: 'app-visualizer-controller',
    templateUrl: './visualizer-controller.component.html',
    styleUrls: ['./visualizer-controller.component.css'],
})
export class VisualizerControllerComponent {
    @Input() config: IVisualizerConfig;
    @Output() remove: EventEmitter<void> = new EventEmitter();

    VisualizerType = VisualizerType;

    onRemove(): void {
        this.remove.emit();
    }
}
