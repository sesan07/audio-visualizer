import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { EntityEmitterType, IEntityEmitterConfig } from './entity-emitter.types';
import { DraggableComponent } from '../shared/components/draggable/draggable.component';
import { EntityService } from '../entity/entity.service';
import { EntityType, IEntityConfig } from '../entity/entity.types';
import { getRandomNumber } from '../shared/utils';
import { VisualizerService } from '../entity/visualizer-entity/visualizer.service';
import { ImageService } from '../entity/image-entity/image.service';
import { IVisualizerConfig } from '../entity/visualizer-entity/visualizer-entity.types';
import { IImageConfig } from '../entity/image-entity/image-entity.types';

@Component({
    selector: 'app-entity-emitter',
    templateUrl: './entity-emitter.component.html',
    styleUrls: ['./entity-emitter.component.css']
})
export class EntityEmitterComponent extends DraggableComponent implements OnInit, AfterViewInit {
    @Input() config: IEntityEmitterConfig;

    private _timeoutRef: ReturnType<typeof setTimeout>;

    constructor(renderer: Renderer2,
                elementRef: ElementRef<HTMLElement>,
                private _entityService: EntityService,
                private _visualizerService: VisualizerService,
                private _imageService: ImageService) {
        super(renderer, elementRef);
    }

    ngOnInit(): void {
        // setTimeout instead of setInterval to use updated config interval
        this._timeoutRef = setTimeout(() => this._emitEntity(), this.config.interval * 1000);
    }

    ngAfterViewInit(): void {
        this._setPosition(this.config.left ?? 0, this.config.top ?? 0)
    }

    ngOnDestroy(): void {
        clearInterval(this._timeoutRef);
    }

    // TODO add ability to emit more than one at a time
    private _emitEntity(): void {
        const rect: DOMRect = this._elementRef.nativeElement.getBoundingClientRect();
        const entity: IEntityConfig = Object.assign({}, this.config.entity)
        entity.entityContentConfig = Object.assign({}, this.config.entity.entityContentConfig)

        // Randomize start position
        if (this.config.emitterType === EntityEmitterType.POINT) {
            entity.startX = rect.left + rect.width / 2;
            entity.startY = rect.top + rect.height / 2;
        }

        // Randomize movement animation
        if (entity.animateMovement && entity.randomizeMovement) {
            entity.movementAngle = getRandomNumber(0, 360);
            entity.movementSpeed = getRandomNumber(0.5, 2);
        }

        switch (entity.type) {
            case EntityType.VISUALIZER:
                this._visualizerService.beforeEmit(entity.entityContentConfig as IVisualizerConfig);
                break;
            case EntityType.IMAGE:
                this._imageService.beforeEmit(entity.entityContentConfig as IImageConfig);
                break;
        }

        this._entityService.addEmittedEntity(entity, this.config.lifespan * 1000)

        this._timeoutRef = setTimeout(() => this._emitEntity(), this.config.interval * 1000);
    }

}
