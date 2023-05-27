import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityEditGeneralComponent } from './entity-edit-general.component';

describe('EntityEditGeneralComponent', () => {
  let component: EntityEditGeneralComponent;
  let fixture: ComponentFixture<EntityEditGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ EntityEditGeneralComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityEditGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
