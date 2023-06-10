import { Injectable } from '@angular/core';

import { Entity } from 'src/app/entity-service/entity.types';
import { AudioSourceService } from 'src/app/source-services/audio.source.service';
import { getRandomColor } from 'src/app/utils';
import { BaseContentService } from '../base/base.content.service';
import { BarContentAnimator } from './bar.content.animator';
import { BarContent } from './bar.content.types';

@Injectable({
    providedIn: 'root',
})
export class BarContentService extends BaseContentService<BarContent> {
    protected _animator: BarContentAnimator;

    constructor(private _audioService: AudioSourceService) {
        super();
        this._animator = new BarContentAnimator(_audioService.amplitudesMap, _audioService.oomph);
    }

    override beforeEmit(content: BarContent): void {
        super.beforeEmit(content);
        if (content.randomStartColor) {
            content.startColor = getRandomColor();
        }
        if (content.randomEndColor) {
            content.endColor = getRandomColor();
        }
    }

    getDefaultContent(isEmitted: boolean): BarContent {
        return {
            isEmitted: isEmitted,
            startColor: getRandomColor(),
            endColor: getRandomColor(),
            multiplier: 1,
            shadowBlur: 0,
            sampleCount: this._audioService.sampleCounts[0],
            barCapSize: 10,
            barSize: 60,
            barSpacing: 20,
            isReversed: false,
        };
    }

    setEntityDimensions({ content, transform }: Entity<BarContent>): void {
        const barHeight: number = content.multiplier * 255;
        const barCapHeight: number = content.barCapSize;
        transform.height = (barHeight + barCapHeight) * transform.scale;

        const barSpacing: number = content.barSpacing;
        const barSize: number = content.barSize;
        const totalBarSpacing: number = (content.sampleCount - 1) * barSpacing;
        transform.width = (content.sampleCount * barSize + totalBarSpacing) * transform.scale;
    }

    protected _getAddPreset(config: BarContent): BarContent {
        const configClone: BarContent = { ...config };
        return configClone;
    }

    protected _getLoadPreset(config: BarContent): BarContent {
        const configClone: BarContent = { ...config };
        return configClone;
    }
}
