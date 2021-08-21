import { Component, Input } from '@angular/core';
import { EntityType, IEntityConfig, IEntityContentConfig } from '../entity/entity.types';
import { EntityService } from '../entity/entity.service';
import { EntityEmitterService } from '../entity-emitter/entity-emitter.service';
import { VisualizerService } from '../entity/visualizer-entity/visualizer.service';
import { ImageService } from '../entity/image-entity/image.service';

@Component({
    selector: 'app-entity-controller',
    templateUrl: './entity-controller.component.html',
    styleUrls: ['./entity-controller.component.css'],
})
export class EntityControllerComponent {
    @Input() config: IEntityConfig;

    EntityType = EntityType;
    entityTypeOptions: EntityType[] = Object.values(EntityType);
    nameEditPopOverVisible: boolean;

    constructor(private _entityService: EntityService,
                private _entityEmitterService: EntityEmitterService,) {
    }

    onEntityTypeChange(newType: EntityType): void {
        this.config.type = newType;

        let entityContent: IEntityContentConfig;
        if (this.config.isEmitted) {
            entityContent = this._entityEmitterService.getDefaultEntityContent(newType);
            // this._entityEmitterService.changeEntityType(newType, this.config)
            // Object.assign(this.config, this._entityEmitterService.getDefaultEmitterEntity(this.config.type))
        } else {
            entityContent = this._entityService.getDefaultEntityContent(newType);
            // this._entityService.changeEntityType(newType, this.config)
        }

        Object.assign(this.config.entityContentConfig, entityContent)
        this._entityService.setEntityDimensions(this.config)
    }

    onDimensionsChange(): void {
        this._entityService.setEntityDimensions(this.config);
    }
}
