import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizerCanvasComponent } from './visualizer-canvas.component';

describe('VisualizerCanvasComponent', () => {
  let component: VisualizerCanvasComponent;
  let fixture: ComponentFixture<VisualizerCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizerCanvasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizerCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
