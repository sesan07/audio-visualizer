import { Component, Input } from '@angular/core';
import { IEntityConfig } from '../../../entity/entity.types';
import { AudioSourceService } from '../../../shared/source-services/audio.source.service';
import { ICircleContentConfig } from '../circle.content.types';
import { CircleContentService } from '../circle.content.service';

@Component({
    selector: 'app-circle-controller',
    templateUrl: './circle-controller.component.html'
})
export class CircleControllerComponent {
    @Input() entity: IEntityConfig<ICircleContentConfig>;

    get config(): ICircleContentConfig {
        return this.entity.entityContentConfig;
    }

    sampleCountOptions: number[];

    constructor(private _audioService: AudioSourceService, private _circleContentService: CircleContentService) {
        this.sampleCountOptions = this._audioService.sampleCounts;
    }

    onSampleCountChanged(): void {
        this.config.amplitudes = this._audioService.getAmplitudes(this.config.sampleCount);
        this.onDimensionsChange();
    }

    onDimensionsChange(): void {
        this._circleContentService.setEntityDimensions(this.entity);
    }

}
