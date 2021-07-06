import { Component, ElementRef, Input, NgZone, OnChanges, OnDestroy, Renderer2, SimpleChanges } from '@angular/core';
import { IVisualizerConfig, VisualizerType } from './visualizer.types';
import { getRadians, getRandomNumber } from '../shared/utils';
import { DraggableComponent } from '../shared/draggable/draggable.component';

@Component({
    selector: 'app-visualizer',
    templateUrl: './visualizer.component.html',
    styleUrls: ['./visualizer.component.scss']
})
export class VisualizerComponent extends DraggableComponent implements OnChanges, OnDestroy {
    @Input() boundaryElement: HTMLElement;
    @Input() config: IVisualizerConfig;
    @Input() showOutline: boolean;
    @Input() animate: boolean = true;
    @Input() animationAngle: number = getRandomNumber(0, 360);
    @Input() animationSpeed: number = getRandomNumber(0.5, 2);

    // todo: fall down effect (slowly change angle to 90 degrees)

    // This allows VisualizerType to be used in the HTML file
    VisualizerType = VisualizerType;

    private _animationFrameId: number;
    private _animationAngleRadians: number = getRadians(this.animationAngle);

    constructor(renderer: Renderer2, elementRef: ElementRef<HTMLElement>, private _ngZone: NgZone) {
        super(renderer, elementRef);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.animationAngle) {
            this._animationAngleRadians = getRadians(this.animationAngle);
        }
    }

    ngAfterViewInit(): void {
        const clientWidth: number = this._elementRef.nativeElement.clientWidth;
        const clientHeight: number = this._elementRef.nativeElement.clientHeight;

        let left: number;
        let top: number;
        if (this.config.startLeft && this.config.startTop) {
            left = this.config.startLeft - clientWidth / 2;
            top = this.config.startTop - clientHeight / 2;
        } else {
            left = getRandomNumber(0, this.boundaryElement.clientWidth - clientWidth);
            top = getRandomNumber(0, this.boundaryElement.clientHeight - clientHeight);
        }

        this._setPosition(left, top);
        this._animate();
    }

    private _animate() {
        this._ngZone.runOutsideAngular(() => {
            if (this.animate) {
                const angleRadians: number = this._animationAngleRadians;
                const newLeft: number = this._left + this.animationSpeed * Math.cos(angleRadians);
                const newTop: number = this._top + this.animationSpeed * Math.sin(angleRadians);
                this._setPosition(newLeft, newTop);
            }

            this._animationFrameId = requestAnimationFrame(() => this._animate());
        });
    }

    ngOnDestroy(): void {
        // Stop animation
        if (this._animationFrameId) {
            if (this.config.animationStopTime > 0) {
                // Stop after some time
                // Useful if the component is still visible for some time after destruction
                setTimeout(() => {
                    cancelAnimationFrame(this._animationFrameId);
                }, this.config.animationStopTime);
            } else {
                // Stop immediately
                cancelAnimationFrame(this._animationFrameId);
            }
        }
    }
}
