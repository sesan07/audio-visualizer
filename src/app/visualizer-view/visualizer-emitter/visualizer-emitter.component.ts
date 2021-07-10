import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { EmitterType, IEmitterConfig } from './visualizer-emitter.types';
import { DraggableComponent } from '../draggable/draggable.component';
import { VisualizerService } from '../../services/visualizer.service';
import { IVisualizerConfig } from '../visualizer/visualizer.types';
import { getRandomNumber } from '../../shared/utils';
import { getRandomColorHex } from 'visualizer';

@Component({
    selector: 'app-visualizer-emitter',
    templateUrl: './visualizer-emitter.component.html',
    styleUrls: ['./visualizer-emitter.component.css']
})
export class VisualizerEmitterComponent extends DraggableComponent implements OnInit {
    @Input() config: IEmitterConfig;

    private _timeoutRef: number;

    constructor(renderer: Renderer2, elementRef: ElementRef<HTMLElement>, private _visualizerService: VisualizerService) {
        super(renderer, elementRef);
    }

    ngOnInit(): void {
        // setTimeout instead of setInterval to use updated config interval
        this._timeoutRef = setTimeout(() => this._emitVisualizer(), this.config.interval * 1000);
    }

    ngOnDestroy(): void {
        clearInterval(this._timeoutRef);
    }

    private _emitVisualizer(): void {
        const rect: DOMRect = this._elementRef.nativeElement.getBoundingClientRect();
        const visualizer: IVisualizerConfig = Object.assign({}, this.config.visualizer)
        visualizer.startLeft = this.config.emitterType === EmitterType.POINT ? rect.left + rect.width / 2 : undefined;
        visualizer.startTop = this.config.emitterType === EmitterType.POINT ? rect.top + rect.height / 2: undefined
        if (this.config.randomizeColors) {
            visualizer.startColorHex = getRandomColorHex();
            visualizer.endColorHex = getRandomColorHex();
        }
        this._visualizerService.addEmittedVisualizer(visualizer, this.config.lifespan * 1000)

        this._timeoutRef = setTimeout(() => this._emitVisualizer(), this.config.interval * 1000);
    }

}
