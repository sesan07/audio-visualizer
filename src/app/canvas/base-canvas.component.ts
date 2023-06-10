import { AfterViewInit, Component, ElementRef, HostListener, Input, NgZone, OnDestroy, ViewChild } from '@angular/core';

@Component({
    template: '',
    standalone: true,
})
export abstract class BaseCanvasComponent implements AfterViewInit, OnDestroy {
    @Input() viewScale: number = 1;

    @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

    protected _canvasContext!: CanvasRenderingContext2D;
    protected _height!: number;
    protected _width!: number;
    protected _animationFrameId!: number;

    constructor(private _ngZone: NgZone, private _elementRef: ElementRef<HTMLElement>) {}

    ngAfterViewInit(): void {
        this._canvasContext = this.canvasElement.nativeElement.getContext('2d')!;

        this.updateViewDimensions();
        this._ngZone.runOutsideAngular(() => this._animateCanvas());
    }

    ngOnDestroy(): void {
        cancelAnimationFrame(this._animationFrameId);
    }

    @HostListener('window:resize')
    updateViewDimensions(): void {
        this._height = this._elementRef.nativeElement.clientHeight;
        this._width = this._elementRef.nativeElement.clientWidth;
        this.canvasElement.nativeElement.height = this._height;
        this.canvasElement.nativeElement.width = this._width;
    }

    private _animateCanvas(): void {
        if (!this._canvasContext) {
            this._animationFrameId = requestAnimationFrame(() => this._animateCanvas());
            return;
        }

        this._canvasContext.clearRect(0, 0, this._width, this._height);
        this._animate();

        this._animationFrameId = requestAnimationFrame(() => this._animateCanvas());
    }

    protected abstract _animate(): void;
}
