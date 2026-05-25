import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAppointments } from './view-appointments';

describe('ViewAppointments', () => {
  let component: ViewAppointments;
  let fixture: ComponentFixture<ViewAppointments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAppointments],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewAppointments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
