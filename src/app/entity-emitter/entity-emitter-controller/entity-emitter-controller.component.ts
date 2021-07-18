import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EntityEmitterType, IEntityEmitterConfig } from '../entity-emitter.types';
import { IVisualizerConfig, EntityType } from '../../entity/entity.types';
import { EntityService } from '../../entity/entity.service';

@Component({
    selector: 'app-entity-emitter-controller',
    templateUrl: './entity-emitter-controller.component.html',
    styleUrls: ['./entity-emitter-controller.component.css']
})
export class EntityEmitterControllerComponent {
    @Input() config: IEntityEmitterConfig;

    emitterTypeOptions: EntityEmitterType[] = Object.values(EntityEmitterType);
    visualizerTypeOptions: EntityType[] = Object.values(EntityType);

    constructor(private _visualizerService: EntityService) {
    }

    onVisualizerTypeChange(): void {
        const newLibConfig: IVisualizerConfig = this._visualizerService.getDefaultLibVisualizerConfig(this.config.entity.type)
        this.config.entity = Object.assign(this.config.entity, newLibConfig);
    }
}
