import { Component, Input } from '@angular/core';
import { IVisualizerConfig, VisualizerType } from './visualizer-entity.types';

@Component({
    selector: 'app-visualizer-entity',
    templateUrl: './visualizer-entity.component.html',
    styleUrls: ['./visualizer-entity.component.css']
})
export class VisualizerEntityComponent {
    @Input() config: IVisualizerConfig;
    @Input() animationStopTime: number;
    @Input() oomphAmplitudes: Uint8Array;
    @Input() oomphAmount: number;

    // This allows VisualizerType to be used in the HTML file
    VisualizerType = VisualizerType;

    constructor() {
    }

}
