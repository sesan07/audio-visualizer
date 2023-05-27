import { Component, ElementRef, HostListener, Input, NgZone, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntityLayer } from '../app.types';
import { AudioSourceService } from '../shared/source-services/audio.source.service';
import { Oomph } from '../shared/source-services/audio.source.service.types';

@Component({
    selector: 'app-background-canvas',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './background-canvas.component.html',
    styleUrls: ['./background-canvas.component.scss'],
})
export class BackgroundCanvasComponent {
    @Input() oomphAmount: number = 0;
    @Input() opacity: number = 1;
    @Input() viewElement!: HTMLElement;
    @Input() viewScale!: number;

    @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

    private _canvasContext!: CanvasRenderingContext2D;
    private _height!: number;
    private _width!: number;
    private _animationFrameId!: number;
    private _image: HTMLImageElement = new Image();
    private _oomph: Oomph;

    @HostListener('window:resize')
    updateViewDimensions(): void {
        console.log('resize');
        this._height = this._elementRef.nativeElement.clientHeight;
        this._width = this._elementRef.nativeElement.clientWidth;
        this.canvasElement.nativeElement.height = this._height;
        this.canvasElement.nativeElement.width = this._width;
    }

    constructor(
        // private _renderer: Renderer2,
        audioService: AudioSourceService,
        private _ngZone: NgZone,
        private _elementRef: ElementRef<HTMLElement>
    ) {
        this._oomph = audioService.oomph;
        // this._image.
        this._image.addEventListener('load', () => {
            this._start();
        });
        this._image.src = 'assets/background-image/default.jpg';
    }

    ngAfterViewInit(): void {
        this._canvasContext = this.canvasElement.nativeElement.getContext('2d')!;

        this.updateViewDimensions();
    }

    ngOnDestroy(): void {
        cancelAnimationFrame(this._animationFrameId);
    }

    private _start(): void {
        this._ngZone.runOutsideAngular(() => this._animateCanvas());
    }

    private _animateCanvas(): void {
        if (!this._canvasContext) {
            return;
        }
        // console.log('3', NgZone.isInAngularZone());
        this._canvasContext.clearRect(0, 0, this._width, this._height);

        const oomphScale: number = 1 + this._oomph.value * this.oomphAmount;
        const width: number = this._width * oomphScale;
        const height: number = this._height * oomphScale;
        const left: number = 0 - (width - this._width) / 2;
        const top: number = 0 - (height - this._height) / 2;

        this._canvasContext.globalAlpha = this.opacity;
        this._canvasContext.drawImage(this._image, left, top, width, height);

        this._animationFrameId = requestAnimationFrame(() => this._animateCanvas());
    }
}
