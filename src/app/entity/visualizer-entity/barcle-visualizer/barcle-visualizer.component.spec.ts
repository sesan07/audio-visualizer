import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcleVisualizerComponent } from './barcle-visualizer.component';

describe('BarcleVisualizerComponent', () => {
  let component: BarcleVisualizerComponent;
  let fixture: ComponentFixture<BarcleVisualizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarcleVisualizerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarcleVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
