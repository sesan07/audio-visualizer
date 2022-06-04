import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Entity, EntityType } from '../../../entity/entity.types';
import { EmitterType, Emitter } from '../../../emitter/emitter.types';
import { animations } from '../../animations';

type TestType = Entity | Emitter;
@Component({
    selector: 'app-controller-wrapper',
    templateUrl: './controller-wrapper.component.html',
    styleUrls: [ './controller-wrapper.component.scss' ],
    animations: animations
})
export class ControllerWrapperComponent implements OnInit {
    @Input() type: 'entity' | 'emitter';
    @Input() addOptions: (EntityType | EmitterType)[];
    @Input() activeConfig: Entity | Emitter;
    @Input() configs: (Entity | Emitter)[];
    @Output() add: EventEmitter<EntityType | EmitterType> = new EventEmitter();
    @Output() remove: EventEmitter<Entity | Emitter> = new EventEmitter();
    @Output() configSelect: EventEmitter<Entity | Emitter> = new EventEmitter();
    @Output() moveUp: EventEmitter<number> = new EventEmitter();
    @Output() moveDown: EventEmitter<number> = new EventEmitter();
    @Output() duplicate: EventEmitter<number> = new EventEmitter();
    @Output() closeActive: EventEmitter<void> = new EventEmitter();

    selectedAddOption: EntityType | EmitterType;

    get name(): string {
        return this.type === 'entity' ? 'Entity' : 'Emitter';
    }

    get activeConfigAsEntity(): Entity {
        return this.activeConfig as Entity;
    }

    get activeConfigAsEmitter(): Emitter {
        return this.activeConfig as Emitter;
    }

    ngOnInit(): void {
        this.selectedAddOption = this.addOptions[0];
    }

    onConfigSelected(event: MouseEvent, config: Entity | Emitter): void {
        config = this.activeConfig === config ? null : config; // If clicking active config, unset it
        this.configSelect.emit(config);
        event.stopPropagation();
    }

    onAddOptionClicked(option: EntityType | EmitterType): void {
        this.selectedAddOption = option;
        this.add.emit(option);
    }
}
