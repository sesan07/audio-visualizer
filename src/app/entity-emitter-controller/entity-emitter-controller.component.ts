import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EntityEmitterType, IEntityEmitterConfig } from '../entity-emitter/entity-emitter.types';
import { VisualizerService } from '../entity/visualizer-entity/visualizer.service';

@Component({
    selector: 'app-entity-emitter-controller',
    templateUrl: './entity-emitter-controller.component.html',
    styleUrls: ['./entity-emitter-controller.component.css']
})
export class EntityEmitterControllerComponent {
    @Input() config: IEntityEmitterConfig;

    emitterTypeOptions: EntityEmitterType[] = Object.values(EntityEmitterType);

    constructor(private _visualizerService: VisualizerService) {
    }
}
