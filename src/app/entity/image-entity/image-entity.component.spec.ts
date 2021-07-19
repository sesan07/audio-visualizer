import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageEntityComponent } from './image-entity.component';

describe('ImageEntityComponent', () => {
  let component: ImageEntityComponent;
  let fixture: ComponentFixture<ImageEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageEntityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
