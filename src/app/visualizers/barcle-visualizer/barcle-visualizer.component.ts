import { Component, Input, OnInit } from '@angular/core';
import { IBarcleVisualizerConfig } from './barcle-visualizer.types';

@Component({
  selector: 'app-barcle-visualizer',
  templateUrl: './barcle-visualizer.component.html',
  styleUrls: ['./barcle-visualizer.component.css']
})
export class BarcleVisualizerComponent implements OnInit {
  @Input() config: IBarcleVisualizerConfig;

  constructor() { }

  ngOnInit(): void {

  }

}
