import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleControllerComponent } from './circle-controller.component';

describe('CircleControllerComponent', () => {
  let component: CircleControllerComponent;
  let fixture: ComponentFixture<CircleControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CircleControllerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CircleControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
