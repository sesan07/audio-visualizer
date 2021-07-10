import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IVisualizerConfig, VisualizerType } from '../../visualizer-view/visualizer/visualizer.types';
import { EmitterType, IEmitterConfig } from '../../visualizer-view/visualizer-emitter/visualizer-emitter.types';
import { animations } from '../../shared/animations';

@Component({
    selector: 'app-controller-wrapper',
    templateUrl: './controller-wrapper.component.html',
    styleUrls: ['./controller-wrapper.component.scss'],
    animations: animations
})
export class ControllerWrapperComponent implements OnInit {
    @Input() type: 'visualizer' | 'emitter';
    @Input() addOptions: VisualizerType[] | EmitterType[];
    @Input() activeConfig: IVisualizerConfig | IEmitterConfig;
    @Input() configs: IVisualizerConfig[] | IEmitterConfig[];
    @Output() add: EventEmitter<VisualizerType | EmitterType> = new EventEmitter();
    @Output() remove: EventEmitter<number> = new EventEmitter();
    @Output() configSelect: EventEmitter<IVisualizerConfig | IEmitterConfig> = new EventEmitter();

    selectedAddOption: VisualizerType | EmitterType;

    get name(): string {
        return this.type === 'visualizer' ? 'Visualizer' : 'Emitter'
    }

    ngOnInit(): void {
        this.selectedAddOption = this.addOptions[0];
    }

    onConfigSelected(event: MouseEvent, config: IVisualizerConfig | IEmitterConfig): void {
        this.configSelect.emit(config)
        event.stopPropagation();
    }
}
