import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerEntityComponent } from './layer-entity.component';

describe('LayerEntityComponent', () => {
  let component: LayerEntityComponent;
  let fixture: ComponentFixture<LayerEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LayerEntityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayerEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
