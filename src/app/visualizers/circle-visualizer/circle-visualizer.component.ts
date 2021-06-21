import { Component, Input, OnInit } from '@angular/core';
import { ICircleVisualizerConfig } from './circle-visualizer.types';
import { BaseVisualizerComponent } from '../base-visualizer/base-visualizer.component';

@Component({
  selector: 'app-circle-visualizer',
  templateUrl: './circle-visualizer.component.html',
  styleUrls: ['../base-visualizer/base-visualizer.component.css']
})
export class CircleVisualizerComponent extends BaseVisualizerComponent{
  @Input() config: ICircleVisualizerConfig;
}
