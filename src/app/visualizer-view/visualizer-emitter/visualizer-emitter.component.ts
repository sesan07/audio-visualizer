import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { EmitterType, IEmitterConfig } from './visualizer-emitter.types';
import { DraggableComponent } from '../draggable/draggable.component';
import { VisualizerService } from '../../services/visualizer.service';
import { AudioService } from '../../services/audio.service';
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

    private _intervalRef: number;

    constructor(renderer: Renderer2, elementRef: ElementRef<HTMLElement>, private _audioService: AudioService, private _visualizerService: VisualizerService) {
        super(renderer, elementRef);
    }

    ngOnInit(): void {
        this._intervalRef = setInterval(() => {
            const rect: DOMRect = this._elementRef.nativeElement.getBoundingClientRect();
            const visualizer: IVisualizerConfig = Object.assign({}, this.config.visualizer)
            visualizer.startLeft = this.config.emitterType === EmitterType.POINT ? rect.left + rect.width / 2 : undefined;
            visualizer.startTop = this.config.emitterType === EmitterType.POINT ? rect.top + rect.height / 2: undefined
            if (this.config.randomizeColors) {
                visualizer.startColorHex = getRandomColorHex();
                visualizer.endColorHex = getRandomColorHex();
            }
            this._visualizerService.addEmittedVisualizer(visualizer, getRandomNumber(5000, 10000))
        }, this.config.interval)
    }

    ngOnDestroy(): void {
        clearInterval(this._intervalRef);
    }

}
