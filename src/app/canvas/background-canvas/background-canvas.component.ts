import { ChangeDetectionStrategy, Component, ElementRef, Input, NgZone, OnChanges, SimpleChanges } from '@angular/core';

import { AudioSourceService } from '../../source-services/audio.source.service';
import { Oomph } from '../../source-services/audio.source.service.types';
import { BackgroundImageSourceService } from '../../source-services/background-image.source.service';
import { Source } from '../../source-services/base.source.service.types';
import { BaseCanvasComponent } from '../base-canvas.component';

@Component({
    selector: 'app-background-canvas',
    standalone: true,
    templateUrl: './background-canvas.component.html',
    styleUrls: ['./background-canvas.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundCanvasComponent extends BaseCanvasComponent implements OnChanges {
    @Input() activeSource?: Source;

    private _image: HTMLImageElement = new Image();
    private _oomph: Oomph;

    constructor(
        ngZone: NgZone,
        elementRef: ElementRef<HTMLElement>,
        audioService: AudioSourceService,
        private _bgImageService: BackgroundImageSourceService
    ) {
        super(ngZone, elementRef);
        this._oomph = audioService.oomph;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['activeSource']) {
            this._image.src = this.activeSource?.src?.toString() ?? '';
        }
    }

    protected _animate(): void {
        const oomphScale: number = this._oomph.value * this._bgImageService.oomph + 1;
        const diffRatio: number = Math.max(this._width / this._image.width, this._height / this._image.height);
        const scaledImgW: number = this._image.width * diffRatio * oomphScale;
        const scaledImgH: number = this._image.height * diffRatio * oomphScale;
        const wDiff: number = this._width - scaledImgW;
        const hDiff: number = this._height - scaledImgH;

        const left: number = wDiff / 2;
        const top: number = hDiff / 2;

        this._canvasContext.globalAlpha = this._bgImageService.opacity;
        this._canvasContext.drawImage(this._image, left, top, scaledImgW, scaledImgH);
    }
}
