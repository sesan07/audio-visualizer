import { Component, Input } from '@angular/core';
import { AudioService } from '../../shared/audio-service/audio.service';
import { IVisualizerConfig, VisualizerType } from '../../entity/visualizer-entity/visualizer-entity.types';
import { VisualizerService } from '../../entity/visualizer-entity/visualizer.service';
import { EntityType, IEntityConfig } from '../../entity/entity.types';

@Component({
    selector: 'app-visualizer-controller',
    templateUrl: './visualizer-controller.component.html',
    styleUrls: ['./visualizer-controller.component.css']
})
export class VisualizerControllerComponent {
    @Input() entity: IEntityConfig<IVisualizerConfig>;

    get config(): IVisualizerConfig {
        return this.entity.entityContentConfig
    }

    EntityType = EntityType;

    visualizerTypeOptions: VisualizerType[] = [EntityType.BAR_VISUALIZER, EntityType.BARCLE_VISUALIZER, EntityType.CIRCLE_VISUALIZER];
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
        this.onDimensionsChange();
    }

    onDimensionsChange(): void {
        this._visualizerService.setEntityDimensions(this.entity);
    }

    // onVisualizerTypeChange(): void {
    //     Object.assign(this.config, this._visualizerService.getDefaultContent(this.config.type, this.config.isEmitted));
    // }
}
