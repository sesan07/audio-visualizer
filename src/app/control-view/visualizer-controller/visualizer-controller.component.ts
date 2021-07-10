import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IVisualizerConfig, VisualizerType } from '../../visualizer-view/visualizer/visualizer.types';
import { AudioService } from '../../services/audio.service';

@Component({
    selector: 'app-visualizer-controller',
    templateUrl: './visualizer-controller.component.html',
    styleUrls: ['./visualizer-controller.component.css'],
})
export class VisualizerControllerComponent {
    @Input() config: IVisualizerConfig;

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

    constructor(private _audioService: AudioService) {
        this.sampleCountOptions = this._audioService.sampleCounts;
    }

    onSampleCountChanged(sampleCount: number): void {
        this.config.sampleCount = sampleCount;
        this.config.amplitudes = this._audioService.getAmplitudes(sampleCount);
    }
}