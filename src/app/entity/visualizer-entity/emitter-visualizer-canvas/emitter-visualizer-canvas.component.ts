import { Component, ElementRef, Input, NgZone, OnInit } from '@angular/core';
import { VisualizerCanvasComponent } from '../visualizer-canvas/visualizer-canvas.component';
import { EntityService } from '../../entity.service';
import { VisualizerService } from '../visualizer.service';
import { AudioService } from '../../../shared/audio-service/audio.service';
import { EntityEmitterType, IEntityEmitterConfig } from '../../../entity-emitter/entity-emitter.types';
import { EntityType, IEntityConfig } from '../../entity.types';
import { getRandomNumber } from '../../../shared/utils';
import {
    IBarcleVisualizerConfig,
    IBarVisualizerConfig,
    ICircleVisualizerConfig,
    IVisualizerConfig,
    VisualizerType
} from '../visualizer-entity.types';
import { IImageConfig } from '../../image-entity/image-entity.types';
import { ImageService } from '../../image-entity/image.service';

@Component({
    selector: 'app-emitter-visualizer-canvas',
    templateUrl: './emitter-visualizer-canvas.component.html',
    styleUrls: ['./emitter-visualizer-canvas.component.css']
})
export class EmitterVisualizerCanvasComponent extends VisualizerCanvasComponent implements OnInit {
    @Input() config: IEntityEmitterConfig;
    configs: IEntityConfig[] = []

    private _timeoutRef: ReturnType<typeof setTimeout>;

    constructor(ngZone: NgZone,
                elementRef: ElementRef,
                audioService: AudioService,
                private _entityService: EntityService,
                private _visualizerService: VisualizerService,
                private _imageService: ImageService) {
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

        // Set dimensions
        this._visualizerService.setEntityPosition(entity as IEntityConfig<IVisualizerConfig>)

        // Randomize start position
        // if (this.config.emitterType === EntityEmitterType.POINT) {
        //     entity.startX = this._left + this._elementRef.nativeElement.clientWidth / 2;
        //     entity.startY = this._top + this._elementRef.nativeElement.clientHeight / 2;
        // }

        // Randomize movement animation
        if (entity.animateMovement && entity.randomizeMovement) {
            entity.movementAngle = getRandomNumber(0, 360);
            entity.movementSpeed = getRandomNumber(0.5, 2);
        }

        switch (entity.type) {
            case EntityType.BAR_VISUALIZER:
            case EntityType.BARCLE_VISUALIZER:
            case EntityType.CIRCLE_VISUALIZER:
                this._visualizerService.beforeEmit(entity.entityContentConfig as IVisualizerConfig);
                break;
            case EntityType.IMAGE:
                this._imageService.beforeEmit(entity.entityContentConfig as IImageConfig);
                break;
        }

        this.configs.push(entity);
        setTimeout(() => {
            const index = this.configs.indexOf(entity);
            this.configs.splice(index, 1);
        }, this.config.lifespan * 1000)
        // this._entityService.addEmittedEntity(entity, this.config.lifespan * 1000)
    }

    ngOnDestroy(): void {
        clearTimeout(this._timeoutRef);
    }

}
