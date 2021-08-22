import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IEntityConfig, EntityType } from '../../../entity/entity.types';
import { EmitterType, IEmitterConfig } from '../../../emitter/emitter.types';
import { animations } from '../../animations';

@Component({
    selector: 'app-controller-wrapper',
    templateUrl: './controller-wrapper.component.html',
    styleUrls: ['./controller-wrapper.component.scss'],
    animations: animations
})
export class ControllerWrapperComponent implements OnInit {
    @Input() type: 'entity' | 'emitter';
    @Input() addOptions: EntityType[] | EmitterType[];
    @Input() activeConfig: IEntityConfig | IEmitterConfig;
    @Input() configs: IEntityConfig[] | IEmitterConfig[];
    @Output() add: EventEmitter<EntityType | EmitterType> = new EventEmitter();
    @Output() remove: EventEmitter<IEntityConfig | IEmitterConfig> = new EventEmitter();
    @Output() configSelect: EventEmitter<IEntityConfig | IEmitterConfig> = new EventEmitter();
    @Output() close: EventEmitter<void> = new EventEmitter();
    @Output() duplicateActive: EventEmitter<void> = new EventEmitter();

    selectedAddOption: EntityType | EmitterType;

    get name(): string {
        return this.type === 'entity' ? 'Entity' : 'Entity Emitter'
    }

    ngOnInit(): void {
        this.selectedAddOption = this.addOptions[0];
    }

    onConfigSelected(event: MouseEvent, config: IEntityConfig | IEmitterConfig): void {
        this.configSelect.emit(config)
        event.stopPropagation();
    }
}
