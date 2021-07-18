import { Component, Input } from '@angular/core';
import { AudioService } from '../../shared/audio-service/audio.service';
import { IVisualizerConfig } from '../../entity/visualizer-entity/visualizer-entity.types';
import { VisualizerType } from 'visualizer';
import { VisualizerService } from '../../entity/visualizer-entity/visualizer.service';

@Component({
    selector: 'app-visualizer-controller',
    templateUrl: './visualizer-controller.component.html',
    styleUrls: ['./visualizer-controller.component.css']
})
export class VisualizerControllerComponent {
    @Input() config: IVisualizerConfig;
    @Input() disableColorEdit: boolean;

    VisualizerType = VisualizerType;

    visualizerTypeOptions: VisualizerType[] = Object.values(VisualizerType);
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

    constructor(private _audioService: AudioService, private _visualizerService: VisualizerService) {
        this.sampleCountOptions = this._audioService.sampleCounts;
    }

    onSampleCountChanged(): void {
        this.config.amplitudes = this._audioService.getAmplitudes(this.config.sampleCount);
    }

    onVisualizerTypeChange(): void {
        Object.assign(this.config, this._visualizerService.getDefaultContent(this.config.type))
    }
}
