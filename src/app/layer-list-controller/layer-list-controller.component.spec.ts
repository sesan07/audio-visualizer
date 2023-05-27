import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerListControllerComponent } from './layer-list-controller.component';

describe('LayerListControllerComponent', () => {
  let component: LayerListControllerComponent;
  let fixture: ComponentFixture<LayerListControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LayerListControllerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayerListControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
