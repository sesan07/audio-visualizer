import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EmitterType, IEmitterConfig } from '../visualizer-emitter/visualizer-emitter.types';
import { VisualizerType } from '../visualizer/visualizer.types';

@Component({
    selector: 'app-emitter-controller',
    templateUrl: './emitter-controller.component.html',
    styleUrls: ['./emitter-controller.component.css']
})
export class EmitterControllerComponent {
    @Input() config: IEmitterConfig;
    @Output() remove: EventEmitter<void> = new EventEmitter();

    emitterTypeOptions: EmitterType[] = Object.values(EmitterType);
    visualizerTypeOptions: VisualizerType[] = Object.values(VisualizerType);
}
