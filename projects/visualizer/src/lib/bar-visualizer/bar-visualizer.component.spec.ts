import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarVisualizerComponent } from './bar-visualizer.component';

describe('BarVisualizerComponent', () => {
  let component: BarVisualizerComponent;
  let fixture: ComponentFixture<BarVisualizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarVisualizerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
