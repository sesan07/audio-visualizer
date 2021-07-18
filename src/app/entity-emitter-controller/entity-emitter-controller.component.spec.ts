import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityEmitterControllerComponent } from './entity-emitter-controller.component';

describe('EmitterControllerComponent', () => {
  let component: EntityEmitterControllerComponent;
  let fixture: ComponentFixture<EntityEmitterControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityEmitterControllerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityEmitterControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
