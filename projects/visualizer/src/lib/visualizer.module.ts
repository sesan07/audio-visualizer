import { NgModule } from '@angular/core';
import { BarVisualizerComponent } from './bar-visualizer/bar-visualizer.component';
import { CircleVisualizerComponent } from './circle-visualizer/circle-visualizer.component';
import { BarcleVisualizerComponent } from './barcle-visualizer/barcle-visualizer.component';

@NgModule({
    declarations: [
        BarVisualizerComponent,
        CircleVisualizerComponent,
        BarcleVisualizerComponent,
    ],
    exports: [
        BarVisualizerComponent,
        CircleVisualizerComponent,
        BarcleVisualizerComponent,
    ],
})
export class VisualizerModule {
}
