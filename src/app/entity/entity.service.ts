import { Injectable } from '@angular/core';
import { EntityType, IEntityConfig, IEntityContentConfig } from './entity.types';
import { AudioService } from '../shared/audio-service/audio.service';
import { VisualizerType } from 'visualizer';
import { VisualizerService } from './visualizer-entity/visualizer.service';

@Injectable({
    providedIn: 'root'
})
export class EntityService {
    activeEntity: IEntityConfig;
    entities: IEntityConfig[] = [];
    emittedEntities: IEntityConfig[] = [];

    constructor(private _audioService: AudioService,
                private _visualizerService: VisualizerService) {
    }

    addEntity(type: EntityType, setActive?: boolean): void {
        const entity: IEntityConfig = this.getDefaultEntity(type);
        this.entities.push(entity)
        if (setActive) {
            this.activeEntity = entity;
        }
    }

    addEmittedEntity(entity: IEntityConfig, autoRemoveTime: number): void {
        this.emittedEntities.push(entity)
        setTimeout(() => this.removeEmittedEntity(entity), autoRemoveTime)
    }

    getDefaultEntity(type: EntityType): IEntityConfig {
        let entityContent: IEntityContentConfig;
        switch (type) {
            case EntityType.VISUALIZER:
                entityContent = this._visualizerService.getDefaultContent(VisualizerType.BAR)
                break;
            default: throw new Error('Unknown entity type')
        }

        return {
            type: type,
            animationStopTime: 1000,
            disableMovement: true,
            animateRotation: false,
            rotation: 0,
            rotationDirection: 'Right',
            rotationSpeed: 0.5,
            entityContentConfig: entityContent
        }
    }

    removeEntity(index: number): void {
        const entity: IEntityConfig = this.entities[index];
        this.entities.splice(index, 1);
        if (entity === this.activeEntity) {
            this.activeEntity = null;
        }
    }

    removeEmittedEntity(entity?: IEntityConfig): void {
        const index: number = this.emittedEntities.indexOf(entity);
        if (index !== -1) {
            this.emittedEntities.splice(index, 1);
        }
    }
}
