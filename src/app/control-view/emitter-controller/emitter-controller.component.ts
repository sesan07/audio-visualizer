import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EmitterType, IEmitterConfig } from '../../visualizer-view/visualizer-emitter/visualizer-emitter.types';
import { VisualizerType } from '../../visualizer-view/visualizer/visualizer.types';
import { VisualizerService } from '../../services/visualizer.service';

@Component({
    selector: 'app-emitter-controller',
    templateUrl: './emitter-controller.component.html',
    styleUrls: ['./emitter-controller.component.css']
})
export class EmitterControllerComponent {
    @Input() config: IEmitterConfig;

    emitterTypeOptions: EmitterType[] = Object.values(EmitterType);
    visualizerTypeOptions: VisualizerType[] = Object.values(VisualizerType);

    constructor(private _visualizerService: VisualizerService) {
    }

    onVisualizerTypeChange(): void {
        this.config.visualizer = this._visualizerService.getDefaultVisualizer(this.config.visualizer.type, this.config.randomizeColors);
    }
}
