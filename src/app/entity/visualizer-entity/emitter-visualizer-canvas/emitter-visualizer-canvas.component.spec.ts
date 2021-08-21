import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmitterVisualizerCanvasComponent } from './emitter-visualizer-canvas.component';

describe('EmitterVisualizerCanvasComponent', () => {
  let component: EmitterVisualizerCanvasComponent;
  let fixture: ComponentFixture<EmitterVisualizerCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmitterVisualizerCanvasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmitterVisualizerCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
