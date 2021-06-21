import { Component, Input } from '@angular/core';
import { IBarcleVisualizerConfig } from './barcle-visualizer.types';
import { BaseVisualizerComponent } from '../base-visualizer/base-visualizer.component';

@Component({
  selector: 'app-barcle-visualizer',
  templateUrl: './barcle-visualizer.component.html',
  styleUrls: ['../base-visualizer/base-visualizer.component.css']
})
export class BarcleVisualizerComponent extends BaseVisualizerComponent{
  @Input() config: IBarcleVisualizerConfig;
}
