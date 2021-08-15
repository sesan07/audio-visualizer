import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IEntityConfig, EntityType } from '../../../entity/entity.types';
import { EntityEmitterType, IEntityEmitterConfig } from '../../../entity-emitter/entity-emitter.types';
import { animations } from '../../animations';

@Component({
    selector: 'app-controller-wrapper',
    templateUrl: './controller-wrapper.component.html',
    styleUrls: ['./controller-wrapper.component.scss'],
    animations: animations
})
export class ControllerWrapperComponent implements OnInit {
    @Input() type: 'entity' | 'emitter';
    @Input() addOptions: EntityType[] | EntityEmitterType[];
    @Input() activeConfig: IEntityConfig | IEntityEmitterConfig;
    @Input() configs: IEntityConfig[] | IEntityEmitterConfig[];
    @Output() add: EventEmitter<EntityType | EntityEmitterType> = new EventEmitter();
    @Output() remove: EventEmitter<number> = new EventEmitter();
    @Output() configSelect: EventEmitter<IEntityConfig | IEntityEmitterConfig> = new EventEmitter();
    @Output() close: EventEmitter<void> = new EventEmitter();

    selectedAddOption: EntityType | EntityEmitterType;

    get name(): string {
        return this.type === 'entity' ? 'Entity' : 'Entity Emitter'
    }

    ngOnInit(): void {
        this.selectedAddOption = this.addOptions[0];
    }

    onConfigSelected(event: MouseEvent, config: IEntityConfig | IEntityEmitterConfig): void {
        this.configSelect.emit(config)
        event.stopPropagation();
    }
}
