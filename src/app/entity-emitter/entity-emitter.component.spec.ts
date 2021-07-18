import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityEmitterComponent } from './entity-emitter.component';

describe('VisualizerEmitterComponent', () => {
  let component: EntityEmitterComponent;
  let fixture: ComponentFixture<EntityEmitterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityEmitterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityEmitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
