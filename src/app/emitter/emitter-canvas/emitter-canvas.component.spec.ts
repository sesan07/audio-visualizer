import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmitterCanvasComponent } from './emitter-canvas.component';

describe('EmitterVisualizerCanvasComponent', () => {
  let component: EmitterCanvasComponent;
  let fixture: ComponentFixture<EmitterCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmitterCanvasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmitterCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
