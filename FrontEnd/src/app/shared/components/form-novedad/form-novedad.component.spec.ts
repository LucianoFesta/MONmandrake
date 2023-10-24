import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormNovedadComponent } from './form-novedad.component';

describe('FormNovedadComponent', () => {
  let component: FormNovedadComponent;
  let fixture: ComponentFixture<FormNovedadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormNovedadComponent]
    });
    fixture = TestBed.createComponent(FormNovedadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
