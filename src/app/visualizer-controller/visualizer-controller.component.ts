import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IVisualizerConfig, VisualizerType } from '../visualizer/visualizer.types';
import { AudioService } from '../services/audio.service';

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
    sampleCountOptions: number[];
    decibelRange: [number, number];

    constructor(private _audioService: AudioService) {
        this.sampleCountOptions = this._audioService.sampleCounts;
    }

    ngOnInit(): void {
        this.decibelRange = [this.config.minDecibels, this.config.maxDecibels]
    }

    onDecibelChanged(): void {
        this.config.minDecibels = this.decibelRange[0]
        this.config.maxDecibels = this.decibelRange[1]
    }

    onSampleCountChanged(sampleCount: number): void {
        this.config.sampleCount = sampleCount;
        this.config.amplitudes = this._audioService.getAmplitudes(sampleCount);
    }
}
