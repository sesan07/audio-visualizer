import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizerEntityComponent } from './visualizer-entity.component';

describe('VisualizerEntityComponent', () => {
  let component: VisualizerEntityComponent;
  let fixture: ComponentFixture<VisualizerEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizerEntityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizerEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
