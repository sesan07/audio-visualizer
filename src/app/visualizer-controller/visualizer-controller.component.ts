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

    modeOptions: any[] = [
        {
            name: 'Frequency',
            value: 'frequency'
        },
        {
            name: 'Time Domain',
            value: 'timeDomain'
        },
    ];
    sampleCountOptions: number[] = [8, 16, 32, 64, 128, 256, 512];
    decibelRange: [number, number];

    ngOnInit(): void {
        this.decibelRange = [this.config.minDecibels, this.config.maxDecibels]
    }

    onDecibelChanged(): void {
        this.config.minDecibels = this.decibelRange[0]
        this.config.maxDecibels = this.decibelRange[1]
    }

    onRemove(): void {
        this.remove.emit();
    }
}
