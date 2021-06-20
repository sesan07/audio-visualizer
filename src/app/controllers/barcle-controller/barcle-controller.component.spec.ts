import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcleControllerComponent } from './barcle-controller.component';

describe('BarcleControllerComponent', () => {
  let component: BarcleControllerComponent;
  let fixture: ComponentFixture<BarcleControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarcleControllerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarcleControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
