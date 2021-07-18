import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizerControllerComponent } from './visualizer-controller.component';

describe('VisualizerControllerComponent', () => {
  let component: VisualizerControllerComponent;
  let fixture: ComponentFixture<VisualizerControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizerControllerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizerControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
