import { Component, Input } from '@angular/core';
import { AudioSourceService } from '../../../shared/source-services/audio.source.service';
import { IEntityConfig } from '../../../entity/entity.types';
import { IBarContentConfig } from '../bar.content.types';
import { BarContentService } from '../bar.content.service';

@Component({
    selector: 'app-bar-controller',
    templateUrl: './bar-controller.component.html'
})
export class BarControllerComponent {
    @Input() entity: IEntityConfig<IBarContentConfig>;

    get config(): IBarContentConfig {
        return this.entity.entityContentConfig
    }

    sampleCountOptions: number[];

    constructor(private _audioService: AudioSourceService, private _barContentService: BarContentService) {
        this.sampleCountOptions = this._audioService.sampleCounts;
    }

    onSampleCountChanged(): void {
        this.config.amplitudes = this._audioService.getAmplitudes(this.config.sampleCount);
        this.onDimensionsChange();
    }

    onDimensionsChange(): void {
        this._barContentService.setEntityDimensions(this.entity);
    }
}
