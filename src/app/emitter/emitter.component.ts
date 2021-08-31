import { AfterViewInit, Component, ElementRef, Input, NgZone, ViewChild } from '@angular/core';
import { EmitterType, IEmitterConfig } from './emitter.types';
import { EntityType, IEntityConfig } from '../entity/entity.types';
import { AudioSourceService } from '../shared/source-services/audio.source.service';
import { EntityService } from '../entity/entity.service';
import { BarContentService } from '../entity-content/bar/bar.content.service';
import { BarcleContentService } from '../entity-content/barcle/barcle.content.service';
import { CircleContentService } from '../entity-content/circle/circle.content.service';
import { ImageContentService } from '../entity-content/image/image.content.service';
import { getRandomNumber } from '../shared/utils';
import { IBarContentConfig } from '../entity-content/bar/bar.content.types';
import { IBarcleContentConfig } from '../entity-content/barcle/barcle.content.types';
import { ICircleContentConfig } from '../entity-content/circle/circle.content.types';
import { IImageContentConfig } from '../entity-content/image/image.content.types';
import { DraggableDirective } from '../shared/components/draggable/draggable.directive';

@Component({
    selector: 'app-emitter',
    templateUrl: './emitter.component.html',
    styleUrls: ['./emitter.component.css']
})
export class EmitterComponent implements AfterViewInit {
    @Input() config: IEmitterConfig;
    @Input() viewScale: number;

    @ViewChild('handle', { read: ElementRef }) handleElement: ElementRef<HTMLElement>;
    @ViewChild('handle', { read: DraggableDirective }) handleDirective: DraggableDirective;

    entities: IEntityConfig[] = [];

    private _timeoutRef: ReturnType<typeof setTimeout>;

    constructor(ngZone: NgZone,
                elementRef: ElementRef,
                audioService: AudioSourceService,
                private _entityService: EntityService,
                private _barContentService: BarContentService,
                private _barcleContentService: BarcleContentService,
                private _circleContentService: CircleContentService,
                private _imageContentService: ImageContentService) {
    }

    ngAfterViewInit(): void {
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

        // Set position
        if (this.config.type === EmitterType.POINT) {
            const centerX = this.handleDirective.left + this.handleElement.nativeElement.clientWidth / 2;
            const centerY = this.handleDirective.top + this.handleElement.nativeElement.clientHeight / 2;
            this._entityService.setEntityPosition(entity, centerX, centerY);
        } else {
            this._entityService.setEntityPosition(entity);
        }

        // Randomize movement animation
        if (entity.animateMovement && entity.randomizeMovement) {
            entity.movementAngle = getRandomNumber(0, 360);
            entity.movementSpeed = getRandomNumber(0.5, 2);
        }

        entity.deathTime = Date.now() + this.config.lifespan * 1000;

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

        this.entities.push(entity);
    }

    ngOnDestroy(): void {
        clearTimeout(this._timeoutRef);
    }

}
