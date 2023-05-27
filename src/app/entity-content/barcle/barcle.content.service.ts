import { Injectable } from '@angular/core';
import { BaseContentService } from '../base/base.content.service';
import { Entity } from '../../app.types';
import { AudioSourceService } from '../../shared/source-services/audio.source.service';
import { BarcleContent } from './barcle.content.types';
import { getRandomColor } from '../../shared/utils';
import { BarcleContentAnimator } from './barcle.content-animator';

@Injectable({
    providedIn: 'root',
})
export class BarcleContentService extends BaseContentService<BarcleContent> {
    protected _animator: BarcleContentAnimator;

    constructor(private _audioService: AudioSourceService) {
        super();
        this._animator = new BarcleContentAnimator(_audioService.amplitudesMap, _audioService.oomph);
    }

    override beforeEmit(content: BarcleContent): void {
        super.beforeEmit(content);
        if (content.randomStartColor) {
            content.startColor = getRandomColor();
        }
        if (content.randomEndColor) {
            content.endColor = getRandomColor();
        }
    }

    getDefaultContent(isEmitted: boolean): BarcleContent {
        return {
            isEmitted: isEmitted,
            startColor: getRandomColor(),
            endColor: getRandomColor(),
            multiplier: 1,
            shadowBlur: 0,
            sampleCount: this._audioService.sampleCounts[0],
            baseRadius: 80,
            ringSize: 20,
            fillCenter: false,
        };
    }

    setEntityDimensions({ content, transform }: Entity<BarcleContent>): void {
        const radius: number = content.multiplier * 255 + content.baseRadius + content.ringSize;
        const diameter: number = radius * 2 * transform.scale;
        transform.height = diameter;
        transform.width = diameter;
    }

    protected _getAddPreset(content: BarcleContent): BarcleContent {
        const contentClone: BarcleContent = { ...content };
        return contentClone;
    }

    protected _getLoadPreset(content: BarcleContent): BarcleContent {
        const contentClone: BarcleContent = { ...content };
        return contentClone;
    }
}
