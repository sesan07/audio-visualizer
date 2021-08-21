import { Component, ElementRef, HostListener, Input, NgZone, ViewChild } from '@angular/core';
import { EntityType, IEntityConfig } from '../../entity.types';
import { AudioService } from '../../../shared/audio-service/audio.service';
import { BarVisualizer } from '../visualizers/bar.visualizer';
import { BarcleVisualizer } from '../visualizers/barcle.visualizer';
import { CircleVisualizer } from '../visualizers/circle.visualizer';
import { IOomph } from '../../../shared/audio-service/audio.service.types';
import { IBarcleVisualizerConfig, IBarVisualizerConfig, ICircleVisualizerConfig, IVisualizerConfig } from '../visualizer-entity.types';
import { ImageVisualizer } from '../visualizers/image.visualizer';
import { IImageConfig } from '../../image-entity/image-entity.types';

@Component({
    selector: 'app-visualizer-canvas',
    templateUrl: './visualizer-canvas.component.html',
    styleUrls: ['./visualizer-canvas.component.css']
})
export class VisualizerCanvasComponent {
    @Input() configs: IEntityConfig[];

    @ViewChild('canvasElement') canvasElement: ElementRef<HTMLCanvasElement>;

    @HostListener('window:resize')
    updateViewDimensions(): void {
        this._height = this._element.clientHeight;
        this._width = this._element.clientWidth;
        this.canvasElement.nativeElement.height = this._height;
        this.canvasElement.nativeElement.width = this._width;
    }

    protected _canvasContext: CanvasRenderingContext2D;
    protected _height: number;
    protected _width: number;
    protected _oomph: IOomph = this._audioService.oomph;

    private _element: HTMLElement;
    private _animationFrameId: number;

    private barVisualizer: BarVisualizer;
    private barcleVisualizer: BarcleVisualizer;
    private circleVisualizer: CircleVisualizer;
    private imageVisualizer: ImageVisualizer;

    constructor(private _ngZone: NgZone, private _elementRef: ElementRef<HTMLElement>, private _audioService: AudioService) {
        this._element = _elementRef.nativeElement;
    }

    ngAfterViewInit(): void {
        // Microsoft Edge's dimensions at AfterViewInit aren't correct, so wait a bit
        // ElementRef dimensions change after some time (even in an empty app) for some reason..........................
        setTimeout(() => {
            this.updateViewDimensions();
            this._canvasContext = this.canvasElement.nativeElement.getContext('2d');

            this.barVisualizer = new BarVisualizer(this._canvasContext, this._oomph);
            this.barcleVisualizer = new BarcleVisualizer(this._canvasContext, this._oomph);
            this.circleVisualizer = new CircleVisualizer(this._canvasContext, this._oomph);
            this.imageVisualizer = new ImageVisualizer(this._canvasContext, this._oomph);

            this._animate();
        }, 500);
    }

    private _animate(): void {
        this._ngZone.runOutsideAngular(() => {
            this._canvasContext.clearRect(0, 0, this._width, this._height);

            this.configs.forEach(entity => {
                switch (entity.type) {
                    case EntityType.BAR_VISUALIZER:
                        this.barVisualizer._animate(entity as IEntityConfig<IBarVisualizerConfig>);
                        break;
                    case EntityType.BARCLE_VISUALIZER:
                        this.barcleVisualizer._animate(entity as IEntityConfig<IBarcleVisualizerConfig>);
                        break;
                    case EntityType.CIRCLE_VISUALIZER:
                        this.circleVisualizer._animate(entity as IEntityConfig<ICircleVisualizerConfig>);
                        break;
                    case EntityType.IMAGE:
                        this.imageVisualizer._animate(entity as IEntityConfig<IImageConfig>);
                        break;

                }

                // TODO use this to highlight selected
                // this._canvasContext.strokeStyle = 'yellow';
                // this._canvasContext.lineWidth = 5;
                // const config: IVisualizerConfig = entity.entityContentConfig;
                // const height: number = config.height * config.scale;
                // const width: number = config.width * config.scale;
                // const left: number = config.left - (width - config.width) / 2;
                // const top: number = config.top - (height - config.height) / 2;
                // this._canvasContext.strokeRect(left, top, width, height);

                // Reset transformation matrix to the identity matrix
                this._canvasContext.setTransform(1, 0, 0, 1, 0, 0);
            });

            this._animationFrameId = requestAnimationFrame(() => this._animate());
        });
    }
}
