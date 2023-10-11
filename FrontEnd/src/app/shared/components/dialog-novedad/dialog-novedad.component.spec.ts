import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNovedadComponent } from './dialog-novedad.component';

describe('DialogNovedadComponent', () => {
  let component: DialogNovedadComponent;
  let fixture: ComponentFixture<DialogNovedadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogNovedadComponent]
    });
    fixture = TestBed.createComponent(DialogNovedadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
