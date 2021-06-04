import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Color, IAudioConfig } from '../visualizer.types';
import { _convertHexToColor } from '../visualizer.utils';
import { Subject } from 'rxjs';
import { VisualizerService } from '../visualizer.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    template: ''
})
export abstract class BaseVisualizerComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

    @Input() audioConfig: IAudioConfig;
    @Input() startColorHex: string;
    @Input() endColorHex: string;
    @Input() oomph: number;
    @Input() scale: number;

    @ViewChild('canvasElement') canvasElement: ElementRef<HTMLCanvasElement>;

    protected _visualizerService: VisualizerService;
    protected _canvasContext: CanvasRenderingContext2D;
    protected _canvasHeight: number;
    protected _canvasWidth: number;
    protected _startColor: Color;
    protected _endColor: Color;

    private _destroy$: Subject<void> = new Subject();

    protected constructor() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.scale && !changes.scale.firstChange) {
            this._setCanvasDimensions();
            this._onScaleChanged();
            this._setUpCanvas();
        }
    }

    ngOnInit(): void {
        this._setCanvasDimensions();
        this._onScaleChanged();
        this._onSampleCountChanged();

        this._visualizerService.amplitudesChange.pipe(takeUntil(this._destroy$)).subscribe(amplitudes => {
            this._animate(amplitudes);
        });
        this._visualizerService.sampleCountChange.pipe(takeUntil(this._destroy$)).subscribe(sampleCount => {
            this._onSampleCountChanged();
            this._setUpCanvas();
        });

        this._startColor = _convertHexToColor(this.startColorHex);
        this._endColor = _convertHexToColor(this.endColorHex);
    }

    ngAfterViewInit(): void {
        this._setUpCanvas();
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    protected _setCanvasDimensions(): void {
        this._canvasHeight = this._getCanvasHeight();
        this._canvasWidth = this._getCanvasWidth();
    }

    private _setUpCanvas(): void {
        this._canvasContext = this.canvasElement.nativeElement.getContext('2d');
        this.canvasElement.nativeElement.width = this._canvasWidth;
        this.canvasElement.nativeElement.height = this._canvasHeight;
    }

    protected abstract _animate(amplitudes: Uint8Array): void;

    protected abstract _getCanvasHeight(): number;

    protected abstract _getCanvasWidth(): number;

    protected abstract _onSampleCountChanged(): void;

    protected abstract _onScaleChanged(): void;
}
