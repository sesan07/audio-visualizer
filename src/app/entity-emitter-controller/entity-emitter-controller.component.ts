import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EntityEmitterType, IEntityEmitterConfig } from '../entity-emitter/entity-emitter.types';
import { EntityType } from '../entity/entity.types';
import { VisualizerService } from '../entity/visualizer-entity/visualizer.service';

@Component({
    selector: 'app-entity-emitter-controller',
    templateUrl: './entity-emitter-controller.component.html',
    styleUrls: ['./entity-emitter-controller.component.css']
})
export class EntityEmitterControllerComponent {
    @Input() config: IEntityEmitterConfig;

    emitterTypeOptions: EntityEmitterType[] = Object.values(EntityEmitterType);
    entityTypeOptions: EntityType[] = Object.values(EntityType);

    constructor(private _visualizerService: VisualizerService) {
    }

    onEntityTypeChange(): void {
        // Todo change entity type
        // const newLibConfig: IEn = this._visualizerService.getDefaultConfig(this.config.entity.type)
        // this.config.entity = Object.assign(this.config.entity, newLibConfig);
    }
}
