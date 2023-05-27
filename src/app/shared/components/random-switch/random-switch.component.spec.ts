import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomSwitchComponent } from './random-switch.component';

describe('RandomSwitchComponent', () => {
  let component: RandomSwitchComponent;
  let fixture: ComponentFixture<RandomSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RandomSwitchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RandomSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
