import { TestBed } from '@angular/core/testing';

import { BaseVisualizerComponent } from './base-visualizer.component';

describe('BaseVisualizerComponent', () => {
  let component: BaseVisualizerComponent;
  // let fixture: ComponentFixture<BaseVisualizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseVisualizerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    // fixture = TestBed.createComponent(BaseVisualizerComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
