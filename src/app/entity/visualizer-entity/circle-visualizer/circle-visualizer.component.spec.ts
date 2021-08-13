import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleVisualizerComponent } from './circle-visualizer.component';

describe('CircleVisualizerComponent', () => {
  let component: CircleVisualizerComponent;
  let fixture: ComponentFixture<CircleVisualizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CircleVisualizerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CircleVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
