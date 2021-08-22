import { Component, Input } from '@angular/core';
import { IEntityConfig } from '../../../entity/entity.types';
import { AudioSourceService } from '../../../shared/source-services/audio.source.service';
import { IBarcleContentConfig } from '../barcle.content.types';
import { BarcleContentService } from '../barcle.content.service';

@Component({
  selector: 'app-barcle-controller',
  templateUrl: './barcle-controller.component.html'
})
export class BarcleControllerComponent {
  @Input() entity: IEntityConfig<IBarcleContentConfig>;

  get config(): IBarcleContentConfig {
    return this.entity.entityContentConfig
  }

  sampleCountOptions: number[];

  constructor(private _audioService: AudioSourceService, private _barcleContentService: BarcleContentService) {
    this.sampleCountOptions = this._audioService.sampleCounts;
  }

  onSampleCountChanged(): void {
    this.config.amplitudes = this._audioService.getAmplitudes(this.config.sampleCount);
    this.onDimensionsChange();
  }

  onDimensionsChange(): void {
    this._barcleContentService.setEntityDimensions(this.entity);
  }
}
