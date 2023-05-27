import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlLineSliderComponent } from './control-line-slider.component';

describe('ControlLineSliderComponent', () => {
  let component: ControlLineSliderComponent;
  let fixture: ComponentFixture<ControlLineSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ControlLineSliderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlLineSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
