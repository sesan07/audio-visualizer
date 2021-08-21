import { Component, Input } from '@angular/core';
import { IVisualizerConfig, VisualizerType } from './visualizer-entity.types';
import { IOomph } from '../../shared/audio-service/audio.service.types';

@Component({
    selector: 'app-visualizer-entity',
    templateUrl: './visualizer-entity.component.html',
    styleUrls: ['./visualizer-entity.component.css']
})
export class VisualizerEntityComponent {
    @Input() config: IVisualizerConfig;
    @Input() animationStopTime: number;
    @Input() oomph: IOomph;
    @Input() oomphAmount: number;

    // This allows VisualizerType to be used in the HTML file
    // VisualizerType = VisualizerType;

    constructor() {
    }

}
