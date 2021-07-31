import { Component, Input, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { BaseVisualizerComponent } from '../base-visualizer/base-visualizer.component';
import { Color } from '../visualizer.types';
import { getGradientColor } from '../visualizer.utils';

@Component({
    selector: 'lib-bar-visualizer',
    templateUrl: './bar-visualizer.component.html',
    styleUrls: ['../base-visualizer/base-visualizer.component.scss']
})
export class BarVisualizerComponent extends BaseVisualizerComponent implements OnChanges {
    @Input() barCapSize: number;
    @Input() barSize: number;
    @Input() barSpacing: number;
    @Input() looseCaps: boolean;

    private _amplitudeCaps: Uint8Array;

    private get _scaledBarSize(): number {
        return this.barSize * this.scale;
    }
    private get _scaledBarCapSize(): number {
        return this.barCapSize * this.scale;
    }
    private get _scaledBarSpacing(): number {
        return this.barSpacing * this.scale;
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

        let currPos = this._canvasPadding;
        this.amplitudes.forEach((amplitude, i) => {
            const originalAmplitude: number = amplitude;
            amplitude *= this.multiplier * this.scale;
            let cap: number = this._amplitudeCaps[i];
            if (this.looseCaps) {
                cap = amplitude > cap ? amplitude : cap;
                this._amplitudeCaps[i] = cap;
            } else {
                cap = amplitude;
            }

            // const gradientColor: Color = _getGradientColor(this._startColor, this._endColor, (i / this._amplitudes.length));
            const gradientColor: Color = getGradientColor(this._startColor, this._endColor, (originalAmplitude / 255));

            this._drawBar(
                currPos,
                this._canvasHeight - this._canvasPadding - amplitude,
                Math.ceil(this._scaledBarSize),
                amplitude,
                gradientColor
            );

            this._drawBar(
                currPos,
                this._canvasHeight - this._canvasPadding - cap - this._scaledBarCapSize,
                Math.ceil(this._scaledBarSize),
                this._scaledBarCapSize,
                this._startColor
            );

            currPos += this._scaledBarSize + this._scaledBarSpacing;
        });
    }

    protected _getCanvasHeight(): number {
        return this.multiplier * 255 * this.scale + this._scaledBarCapSize;
    }

    protected _getCanvasWidth(): number {
        const sampleCount: number = this.sampleCount;
        const totalBarSpacing: number = sampleCount * this._scaledBarSpacing - this._scaledBarSpacing
        return this._scaledBarSize * sampleCount + totalBarSpacing;
    }

    protected _onDimensionsChanged(): void {
        this._amplitudeCaps = new Uint8Array(this.sampleCount);
    }

    private _drawBar(startX: number, startY: number, width: number, height: number, color: Color): void {
        this._canvasContext.fillStyle = `rgb(${color.red}, ${color.green}, ${color.blue})`;
        this._canvasContext.fillRect(startX, startY, width, height);
    }

}
