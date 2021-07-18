import { Component, Input } from '@angular/core';
import { IEntityConfig, EntityType } from '../entity.types';
import { AudioService } from '../../shared/audio-service/audio.service';

@Component({
    selector: 'app-entity-controller',
    templateUrl: './entity-controller.component.html',
    styleUrls: ['./entity-controller.component.css'],
})
export class EntityControllerComponent {
    // Todo this controller should be used to change entity type
    @Input() config: IEntityConfig;

    VisualizerType = EntityType;

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

    onSampleCountChanged(): void {
        this.config.amplitudes = this._audioService.getAmplitudes(this.config.sampleCount);
    }
}
