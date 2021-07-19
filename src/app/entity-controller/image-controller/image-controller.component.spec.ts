import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageControllerComponent } from './image-controller.component';

describe('ImageControllerComponent', () => {
  let component: ImageControllerComponent;
  let fixture: ComponentFixture<ImageControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageControllerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
