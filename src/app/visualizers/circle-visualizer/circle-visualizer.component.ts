import { Component, Input, OnInit } from '@angular/core';
import { ICircleVisualizerConfig } from './circle-visualizer.types';

@Component({
  selector: 'app-circle-visualizer',
  templateUrl: './circle-visualizer.component.html',
  styleUrls: ['./circle-visualizer.component.css']
})
export class CircleVisualizerComponent implements OnInit {
  @Input() config: ICircleVisualizerConfig;

  constructor() { }

  ngOnInit(): void {
  }

}
