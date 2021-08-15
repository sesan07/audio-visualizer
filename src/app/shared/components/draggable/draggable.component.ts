import { Component, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Component({
    template: '',
})
export abstract class DraggableComponent {
    @Input() viewScale: number;

    abstract config: { left?: number, top?: number };
    protected _left: number;
    protected _top: number;

    private _dragOffsetLeft: number;
    private _dragOffsetTop: number;
    private _stopMouseMoveListener: () => void;
    private _stopMouseUpListener: () => void;
    private _stopTouchMoveListener: () => void;
    private _stopTouchEndListener: () => void;

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
        this._dragOffsetLeft = this._left - event.clientX / this.viewScale;
        this._dragOffsetTop = this._top - event.clientY / this.viewScale;

        this._stopMouseMoveListener = this._renderer.listen('window', 'mousemove', event => this._drag(event))
        this._stopMouseUpListener = this._renderer.listen('window', 'mouseup', () => this._stopMouseListeners())
    }

    @HostListener('touchstart', ['$event'])
    onTouchStart(event: TouchEvent) {
        const firstTouch: Touch = event.touches.item(0);
        this._dragOffsetLeft = this._left - firstTouch.clientX / this.viewScale;
        this._dragOffsetTop = this._top - firstTouch.clientY / this.viewScale;

        this._stopTouchMoveListener = this._renderer.listen('window', 'touchmove', event => this._drag(event.touches.item(0)))
        this._stopTouchEndListener = this._renderer.listen('window', 'touchend', () => this._stopTouchListeners())
    }

    protected constructor(protected _renderer: Renderer2,
                          protected _elementRef: ElementRef<HTMLElement>) {
    }

    protected _setPosition(left: number, top: number) {
        this._left = left;
        this._top = top;
        this.config.left = left;
        this.config.top = top;
        this._renderer.setStyle(this._elementRef.nativeElement, 'left', left + 'px')
        this._renderer.setStyle(this._elementRef.nativeElement, 'top', top + 'px')
    }

    private _drag(source: MouseEvent | Touch) {
        const left = source.clientX / this.viewScale + this._dragOffsetLeft
        const top = source.clientY / this.viewScale + this._dragOffsetTop
        this._setPosition(left, top);
    }

    private _stopMouseListeners() {
        this._stopMouseMoveListener();
        this._stopMouseUpListener();
    }

    private _stopTouchListeners() {
        this._stopTouchMoveListener();
        this._stopTouchEndListener();
    }

}
