import { Component, ElementRef, HostListener, Input, NgZone, Renderer2 } from '@angular/core';
import { IVisualizerConfig, VisualizerType } from './visualizer.types';
import { getRandomNumber } from '../shared/utils';
import { AudioService } from '../services/audio.service';

@Component({
    selector: 'app-visualizer',
    templateUrl: './visualizer.component.html',
    styleUrls: ['./visualizer.component.scss']
})
export class VisualizerComponent {
    @Input() boundaryElement: HTMLElement
    @Input() config: IVisualizerConfig;
    @Input() showOutline: boolean;
    @Input() startX: number;
    @Input() startY: number;
    @Input() lifeTime: number = getRandomNumber(0, 5000);
    @Input() animate: boolean = true;
    @Input() animationAngle: number = getRandomNumber(0, 360);
    @Input() animationSpeed: number = 1;

    // todo: fall down effect (slowly change angle to 90 degrees)

    // This allows VisualizerType to be used in the HTML file
    VisualizerType = VisualizerType;

    private _isDragging: boolean;
    private _dragOffsetLeft: number;
    private _dragOffsetTop: number;

    private _animationFrameId: number;

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
        this._isDragging = true;

        const rect: DOMRect = this._elementRef.nativeElement.getBoundingClientRect()
        this._dragOffsetLeft = rect.left - event.clientX
        this._dragOffsetTop = rect.top - event.clientY
    }

    @HostListener('window:mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        if (this._isDragging) {
            this._move(event)
        }
    }

    @HostListener('mouseup')
    onMouseUp() {
        this._isDragging = false;
    }

    @HostListener('touchstart', ['$event'])
    onTouchStart(event: TouchEvent) {
        this._isDragging = true;

        const rect: DOMRect = this._elementRef.nativeElement.getBoundingClientRect()
        const firstTouch: Touch = event.touches.item(0);
        this._dragOffsetLeft = rect.left - firstTouch.clientX
        this._dragOffsetTop = rect.top - firstTouch.clientY
    }

    @HostListener('window:touchmove', ['$event'])
    onTouchMove(event: TouchEvent) {
        if (this._isDragging) {
            this._move(event.touches.item(0))
        }
    }

    @HostListener('touchend')
    onTouchEnd() {
        this._isDragging = false;
    }

    constructor(private _renderer: Renderer2, private _elementRef: ElementRef<HTMLElement>, private _ngZone: NgZone) {
    }

    ngAfterViewInit(): void {
        const rect: DOMRect = this._elementRef.nativeElement.getBoundingClientRect()
        this.startX = getRandomNumber(0, this.boundaryElement.clientWidth - rect.width)
        this.startY = getRandomNumber(0, this.boundaryElement.clientHeight - rect.height)

        this._renderer.setStyle(this._elementRef.nativeElement, 'left', this.startX + 'px')
        this._renderer.setStyle(this._elementRef.nativeElement, 'top', this.startY + 'px')

        this._animate();
    }

    private _animate() {
        this._ngZone.runOutsideAngular(() => {
            if (this.animate) {
                const rect: DOMRect = this._elementRef.nativeElement.getBoundingClientRect()
                const angleRadians: number =  Math.PI / 180 * this.animationAngle; // todo calculate this once at start and when changed
                const newX: number = rect.left + this.animationSpeed * Math.cos(angleRadians)
                const newY: number = rect.top + this.animationSpeed * Math.sin(angleRadians)

                this._renderer.setStyle(this._elementRef.nativeElement, 'left', newX + 'px')
                this._renderer.setStyle(this._elementRef.nativeElement, 'top', newY + 'px')
            }

            this._animationFrameId = requestAnimationFrame(() => this._animate())
        })
    }

    private _move(source: MouseEvent | Touch) {
        const left = source.clientX + this._dragOffsetLeft + window.pageXOffset
        const top = source.clientY + this._dragOffsetTop + window.pageYOffset

        this._renderer.setStyle(this._elementRef.nativeElement, 'left', left + 'px')
        this._renderer.setStyle(this._elementRef.nativeElement, 'top', top + 'px')
    }

    ngOnDestroy(): void {
        // Stop animation
        if (this._animationFrameId) {
            if (this.config.animationStopTime > 0) {
                // Stop after some time
                // Useful if the component is still visible for some time after destruction
                setTimeout(() => {
                    cancelAnimationFrame(this._animationFrameId)
                }, this.config.animationStopTime)
            } else {
                // Stop immediately
                cancelAnimationFrame(this._animationFrameId)
            }
        }
    }
}

