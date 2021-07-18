import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { EntityEmitterType, IEntityEmitterConfig } from './entity-emitter.types';
import { DraggableComponent } from '../shared/components/draggable/draggable.component';
import { EntityService } from '../entity/entity.service';
import { EntityType, IEntityConfig } from '../entity/entity.types';
import { getRandomNumber } from '../shared/utils';
import { VisualizerService } from '../entity/visualizer-entity/visualizer.service';

@Component({
    selector: 'app-entity-emitter',
    templateUrl: './entity-emitter.component.html',
    styleUrls: ['./entity-emitter.component.css']
})
export class EntityEmitterComponent extends DraggableComponent implements OnInit {
    @Input() config: IEntityEmitterConfig;

    private _timeoutRef: ReturnType<typeof setTimeout>;

    constructor(renderer: Renderer2,
                elementRef: ElementRef<HTMLElement>,
                private _entityService: EntityService,
                private _visualizerService: VisualizerService) {
        super(renderer, elementRef);
    }

    ngOnInit(): void {
        // setTimeout instead of setInterval to use updated config interval
        this._timeoutRef = setTimeout(() => this._emitEntity(), this.config.interval * 1000);
    }

    ngOnDestroy(): void {
        clearInterval(this._timeoutRef);
    }

    private _emitEntity(): void {
        const rect: DOMRect = this._elementRef.nativeElement.getBoundingClientRect();
        const entity: IEntityConfig = Object.assign({}, this.config.entity)
        entity.entityContentConfig = Object.assign({}, this.config.entity.entityContentConfig)

        // Randomize position
        // Todo move random start pos here
        entity.startLeft = this.config.emitterType === EntityEmitterType.POINT ? rect.left + rect.width / 2 : undefined;
        entity.startTop = this.config.emitterType === EntityEmitterType.POINT ? rect.top + rect.height / 2: undefined

        // Randomize movement animation
        if (entity.animateMovement && entity.randomizeMovement) {
            entity.movementAngle = getRandomNumber(0, 360);
            entity.movementSpeed = getRandomNumber(0.5, 2);
        }

        switch (entity.type) {
            case EntityType.VISUALIZER:
                this._visualizerService.beforeEmit(entity.entityContentConfig);
                break;
        }

        this._entityService.addEmittedEntity(entity, this.config.lifespan * 1000)

        this._timeoutRef = setTimeout(() => this._emitEntity(), this.config.interval * 1000);
    }

}
