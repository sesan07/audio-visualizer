import { Component, Input } from '@angular/core';
import { EmitterType, IEmitterConfig } from '../emitter.types';

@Component({
    selector: 'app-entity-emitter-controller',
    templateUrl: './emitter-controller.component.html',
    styleUrls: ['./emitter-controller.component.css']
})
export class EmitterControllerComponent {
    @Input() config: IEmitterConfig;

    emitterTypeOptions: EmitterType[] = Object.values(EmitterType);
    nameEditPopOverVisible: boolean;
}
