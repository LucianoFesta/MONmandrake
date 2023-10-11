import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmCambiosComponent } from './abm-cambios.component';

describe('AbmCambiosComponent', () => {
  let component: AbmCambiosComponent;
  let fixture: ComponentFixture<AbmCambiosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AbmCambiosComponent]
    });
    fixture = TestBed.createComponent(AbmCambiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
