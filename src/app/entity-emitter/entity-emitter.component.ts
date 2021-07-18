import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { EntityEmitterType, IEntityEmitterConfig } from './entity-emitter.types';
import { DraggableComponent } from '../shared/components/draggable/draggable.component';
import { EntityService } from '../entity/entity.service';
import { IEntityConfig } from '../entity/entity.types';
import { getRandomNumber } from '../shared/utils';
import { getRandomColorHex } from 'visualizer';

@Component({
    selector: 'app-entity-emitter',
    templateUrl: './entity-emitter.component.html',
    styleUrls: ['./entity-emitter.component.css']
})
export class EntityEmitterComponent extends DraggableComponent implements OnInit {
    @Input() config: IEntityEmitterConfig;

    protected _dragHandle: ElementRef<HTMLElement>

    private _timeoutRef: ReturnType<typeof setTimeout>;

    constructor(renderer: Renderer2, elementRef: ElementRef<HTMLElement>, private _entityService: EntityService) {
        super(renderer, elementRef);
    }

    ngOnInit(): void {
        this._dragHandle = this._elementRef;
        // setTimeout instead of setInterval to use updated config interval
        this._timeoutRef = setTimeout(() => this._emitVisualizer(), this.config.interval * 1000);
    }

    ngOnDestroy(): void {
        clearInterval(this._timeoutRef);
    }

    private _emitVisualizer(): void {
        const rect: DOMRect = this._elementRef.nativeElement.getBoundingClientRect();
        const visualizer: IEntityConfig = Object.assign({}, this.config.entity)

        // Randomize transform
        // Todo move random start pos here
        visualizer.startLeft = this.config.emitterType === EntityEmitterType.POINT ? rect.left + rect.width / 2 : undefined;
        visualizer.startTop = this.config.emitterType === EntityEmitterType.POINT ? rect.top + rect.height / 2: undefined
        visualizer.rotation = getRandomNumber(0, 360);

        // Randomize colors
        if (this.config.randomizeColors) {
            visualizer.startColorHex = getRandomColorHex();
            visualizer.endColorHex = getRandomColorHex();
        }

        // Randomize rotation animation
        if (visualizer.animateRotation) {
            visualizer.rotationSpeed = getRandomNumber(0.5, 2);
        }

        // Randomize movement animation
        if (visualizer.animateMovement) {
            visualizer.movementAngle = getRandomNumber(0, 360);
            visualizer.movementSpeed = getRandomNumber(0.5, 2);
        }

        this._entityService.addEmittedVisualizer(visualizer, this.config.lifespan * 1000)

        this._timeoutRef = setTimeout(() => this._emitVisualizer(), this.config.interval * 1000);
    }

}
