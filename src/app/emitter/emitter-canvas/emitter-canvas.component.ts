import { Component, ElementRef, Input, NgZone, OnInit } from '@angular/core';
import { EntityCanvasComponent } from '../../entity/entity-canvas/entity-canvas.component';
import { EntityService } from '../../entity/entity.service';
import { AudioSourceService } from '../../shared/source-services/audio.source.service';
import { IEmitterConfig } from '../emitter.types';
import { EntityType, IEntityConfig } from '../../entity/entity.types';
import { getRandomNumber } from '../../shared/utils';
import { IImageContentConfig } from '../../entity-content/image/image.content.types';
import { BarContentService } from '../../entity-content/bar/bar.content.service';
import { BarcleContentService } from '../../entity-content/barcle/barcle.content.service';
import { CircleContentService } from '../../entity-content/circle/circle.content.service';
import { ImageContentService } from '../../entity-content/image/image.content.service';
import { IBarContentConfig } from '../../entity-content/bar/bar.content.types';
import { IBarcleContentConfig } from '../../entity-content/barcle/barcle.content.types';
import { ICircleContentConfig } from '../../entity-content/circle/circle.content.types';

@Component({
    selector: 'app-emitter-canvas',
    templateUrl: './emitter-canvas.component.html',
    styleUrls: ['./emitter-canvas.component.css']
})
export class EmitterCanvasComponent extends EntityCanvasComponent implements OnInit {
    @Input() config: IEmitterConfig;
    configs: IEntityConfig[] = []

    private _timeoutRef: ReturnType<typeof setTimeout>;

    constructor(ngZone: NgZone,
                elementRef: ElementRef,
                audioService: AudioSourceService,
                private _entityService: EntityService,
                private _barContentService: BarContentService,
                private _barcleContentService: BarcleContentService,
                private _circleContentService: CircleContentService,
                private _imageContentService: ImageContentService) {
        super(ngZone, elementRef, audioService);
    }

    ngOnInit(): void {
        this._emitEntities();
    }

    private _emitEntities(): void {
        for (let i = 0; i < this.config.amount; i++) {
            this._emitEntity();
        }
        this._timeoutRef = setTimeout(() => this._emitEntities(), this.config.interval * 1000);
    }

    private _emitEntity(): void {
        const entity: IEntityConfig = Object.assign({}, this.config.entity);
        entity.entityContentConfig = Object.assign({}, this.config.entity.entityContentConfig);

        // Randomize start position
        this._entityService.setEntityPosition(entity);

        // Randomize movement animation
        if (entity.animateMovement && entity.randomizeMovement) {
            entity.movementAngle = getRandomNumber(0, 360);
            entity.movementSpeed = getRandomNumber(0.5, 2);
        }

        switch (entity.type) {
            case EntityType.BAR:
                this._barContentService.beforeEmit(entity.entityContentConfig as IBarContentConfig);
                break;
            case EntityType.BARCLE:
                this._barcleContentService.beforeEmit(entity.entityContentConfig as IBarcleContentConfig);
                break;
            case EntityType.CIRCLE:
                this._circleContentService.beforeEmit(entity.entityContentConfig as ICircleContentConfig);
                break;
            case EntityType.IMAGE:
                this._imageContentService.beforeEmit(entity.entityContentConfig as IImageContentConfig);
                break;
        }

        this.configs.push(entity);
        setTimeout(() => {
            const index = this.configs.indexOf(entity);
            this.configs.splice(index, 1);
        }, this.config.lifespan * 1000)
    }

    ngOnDestroy(): void {
        clearTimeout(this._timeoutRef);
    }

}
