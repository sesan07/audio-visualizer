import { Component, Input, NgZone } from '@angular/core';
import { BaseVisualizerComponent } from '../base-visualizer/base-visualizer.component';
import { Color, VisualizerBarOrientation } from '../visualizer.types';
import { convertColorToHex, getGradientColor } from '../visualizer.utils';

@Component({
    selector: 'lib-bar-visualizer',
    templateUrl: './bar-visualizer.component.html',
    styleUrls: ['../base-visualizer/base-visualizer.component.scss']
})
export class BarVisualizerComponent extends BaseVisualizerComponent {

    @Input() barCapSize: number;
    @Input() barCapColor: string;
    @Input() barOrientation: VisualizerBarOrientation;
    @Input() barSize: number;
    @Input() barSpacing: number;
    @Input() looseCaps: boolean;

    protected _canvasHeight: number;
    protected _canvasWidth: number;

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

    protected _animate(): void {
        this._canvasContext.clearRect(0, 0, this._canvasWidth, this._canvasHeight);

        let currPos = 0;
        this.amplitudes.forEach((amplitude, i) => {
            // if (currPos > 150) return
            amplitude *= this.oomph * this.scale;
            let cap: number = this._amplitudeCaps[i];
            if (this.looseCaps) {
                cap = amplitude > cap ? amplitude : cap;
                this._amplitudeCaps[i] = cap;
            } else {
                cap = amplitude;
            }

            // const gradientColor: Color = _getGradientColor(this._startColor, this._endColor, (i / this._amplitudes.length));
            const gradientColor: Color = getGradientColor(this._startColor, this._endColor, (amplitude / 255));
            const color = convertColorToHex(gradientColor);

            if (this.barOrientation === 'vertical') {
                this._drawBar(
                    0,
                    currPos,
                    amplitude,
                    this._scaledBarSize,
                    color
                );

                this._drawBar(
                    cap,
                    currPos,
                    10,
                    this._scaledBarSize,
                    this.barCapColor
                );
            } else {
                this._drawBar(
                    currPos,
                    this._canvasHeight - amplitude,
                    Math.ceil(this._scaledBarSize),
                    amplitude,
                    color
                );

                this._drawBar(
                    currPos,
                    this._canvasHeight - cap - this._scaledBarCapSize,
                    Math.ceil(this._scaledBarSize),
                    this._scaledBarCapSize,
                    this.barCapColor
                );
            }
            currPos += this._scaledBarSize + this._scaledBarSpacing;
        });
    }

    protected _getCanvasHeight(): number {
        const sampleCount: number = this.sampleCount;
        const totalBarSpacing: number = sampleCount * this._scaledBarSpacing - this._scaledBarSpacing
        if (this.barOrientation === 'vertical') {
            return this._scaledBarSize * sampleCount + totalBarSpacing;
        } else {
            return 255 * this.oomph * this.scale + this._scaledBarCapSize;
        }
    }

    protected _getCanvasWidth(): number {
        const sampleCount: number = this.sampleCount;
        const totalBarSpacing: number = sampleCount * this._scaledBarSpacing - this._scaledBarSpacing
        if (this.barOrientation === 'vertical') {
            return 255 * this.oomph * this.scale + this._scaledBarCapSize;
        } else {
            return this._scaledBarSize * sampleCount + totalBarSpacing
        }
    }

    protected _onSampleCountChanged(): void {
        this._amplitudeCaps = new Uint8Array(this.sampleCount);
        this._setCanvasDimensions();
    }

    protected _onScaleChanged(): void {}

    private _drawBar(startX: number, startY: number, width: number, height: number, color: string): void {
        this._canvasContext.fillStyle = color;
        this._canvasContext.fillRect(startX, startY, width, height);
    }

}
