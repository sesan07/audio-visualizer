import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizerEmitterComponent } from './visualizer-emitter.component';

describe('VisualizerEmitterComponent', () => {
  let component: VisualizerEmitterComponent;
  let fixture: ComponentFixture<VisualizerEmitterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizerEmitterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizerEmitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
