import { Component, Input, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { BaseVisualizerComponent } from '../base-visualizer/base-visualizer.component';
import { RGB } from 'ngx-color';
import { getGradientColor } from '../visualizer-entity.utils';

@Component({
    selector: 'lib-bar-visualizer',
    templateUrl: './bar-visualizer.component.html',
    styleUrls: ['../base-visualizer/base-visualizer.component.scss']
})
export class BarVisualizerComponent extends BaseVisualizerComponent implements OnChanges {
    @Input() barCapSize: number;
    @Input() barSize: number;
    @Input() barSpacing: number;

    private _amplitudeCaps: Uint8Array;

    private get _maxScaledBarSize(): number {
        return this.barSize * (this.scale + this.oomphAmount);
    }
    private get _maxScaledBarCapSize(): number {
        return this.barCapSize * (this.scale + this.oomphAmount);
    }
    private get _maxScaledBarSpacing(): number {
        return this.barSpacing * (this.scale + this.oomphAmount);
    }

    private get _scaledBarSize(): number {
        return this.barSize * this._oomphScale;
    }
    private get _scaledBarCapSize(): number {
        return this.barCapSize * this._oomphScale;
    }
    private get _scaledBarSpacing(): number {
        return this.barSpacing * this._oomphScale;
    }

    constructor(ngZone: NgZone) {
        super(ngZone);
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);

        if ((changes.barCapSize && !changes.barCapSize.firstChange)
            || (changes.barSize && !changes.barSize.firstChange)
            || (changes.barSpacing && !changes.barSpacing.firstChange)) {

            this._updateDimensions();
        }
    }

    protected _animate(): void {
        this._canvasContext.clearRect(0, 0, this._canvasWidth, this._canvasHeight);

        const originX = this._canvasWidth / 2;
        const originY = this._canvasHeight / 2;
        const scaledLeft: number = originX - this.oomphWidth / 2;
        const scaledTop: number = originY - this.oomphHeight / 2;

        let currPos = scaledLeft;
        this.amplitudes.forEach(amplitude => {
            const originalAmplitude: number = amplitude;
            amplitude *= this.multiplier * this._oomphScale;

            // const gradientColor: Color = _getGradientColor(this._startColor, this._endColor, (i / this._amplitudes.length));
            const gradientColor: RGB = getGradientColor(this._startColor, this._endColor, (originalAmplitude / 255));

            // Bar
            this._drawBar(
                currPos,
                scaledTop + this.oomphHeight - amplitude,
                Math.ceil(this._scaledBarSize),
                amplitude,
                gradientColor
            );

            // Bar cap
            this._drawBar(
                currPos,
                scaledTop + this.oomphHeight - amplitude - this._scaledBarCapSize,
                Math.ceil(this._scaledBarSize),
                this._scaledBarCapSize,
                this._startColor
            );

            currPos += this._scaledBarSize + this._scaledBarSpacing;
        });
    }

    private get oomphHeight(): number {
        return this.multiplier * 255 * this._oomphScale + this._scaledBarCapSize;
    }

    private get oomphWidth(): number {
        const totalBarSpacing: number = this.sampleCount * this._scaledBarSpacing - this._scaledBarSpacing
        return this._scaledBarSize * this.sampleCount + totalBarSpacing;
    }

    protected _getCanvasHeight(): number {
        return this.multiplier * 255 * (this.scale + this.oomphAmount) + this._maxScaledBarCapSize;
    }

    protected _getCanvasWidth(): number {
        const totalBarSpacing: number = this.sampleCount * this._maxScaledBarSpacing - this._maxScaledBarSpacing
        return this._maxScaledBarSize * this.sampleCount + totalBarSpacing;
    }

    protected _onDimensionsChanged(): void {
        this._amplitudeCaps = new Uint8Array(this.sampleCount);
    }

    private _drawBar(startX: number, startY: number, width: number, height: number, color: RGB): void {
        this._canvasContext.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        this._canvasContext.fillRect(startX, startY, width, height);
    }

}
