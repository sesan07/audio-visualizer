import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { EmitterType, IEmitterConfig } from './visualizer-emitter.types';
import { DraggableComponent } from '../shared/draggable/draggable.component';
import { VisualizerService } from '../services/visualizer.service';
import { AudioService } from '../services/audio.service';
import { IVisualizerConfig } from '../visualizer/visualizer.types';

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
            this._visualizerService.addVisualizer(visualizer)
        }, this.config.interval)
    }

    ngOnDestroy(): void {
        clearInterval(this._intervalRef);
    }

}
