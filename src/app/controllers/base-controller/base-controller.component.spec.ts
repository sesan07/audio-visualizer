import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseControllerComponent } from './base-controller.component';

describe('BaseControllerComponent', () => {
  let component: BaseControllerComponent;
  let fixture: ComponentFixture<BaseControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseControllerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
