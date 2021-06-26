import { Component, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { IVisualizerConfig, VisualizerType } from './visualizer.types';

@Component({
    selector: 'app-visualizer',
    templateUrl: './visualizer.component.html',
    styleUrls: ['./visualizer.component.css']
})
export class VisualizerComponent {
    @Input() config: IVisualizerConfig;
    @Input() showOutline: boolean;

    // This allows VisualizerType to be used in the HTML file
    VisualizerType = VisualizerType;

    private _isDragging: boolean;
    private _offsetLeft: number;
    private _offsetTop: number;

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
        this._isDragging = true;

        const rect: DOMRect = this._elementRef.nativeElement.getBoundingClientRect()
        this._offsetLeft = rect.left - event.clientX
        this._offsetTop = rect.top - event.clientY
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
        this._offsetLeft = rect.left - firstTouch.clientX
        this._offsetTop = rect.top - firstTouch.clientY
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

    constructor(private _renderer: Renderer2, private _elementRef: ElementRef<HTMLElement>) {
    }

    private _move(source: MouseEvent | Touch) {
        const left = source.clientX + this._offsetLeft + window.pageXOffset
        const top = source.clientY + this._offsetTop + window.pageYOffset

        this._renderer.setStyle(this._elementRef.nativeElement, 'left', left + 'px')
        this._renderer.setStyle(this._elementRef.nativeElement, 'top', top + 'px')
    }
}
