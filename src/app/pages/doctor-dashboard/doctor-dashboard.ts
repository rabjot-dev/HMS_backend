import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../services/auth';
import { AppointmentService } from '../../services/appointment';
import { PageHeader } from '../../shared/page-header/page-header';

@Component({
  selector: 'app-doctor-dashboard',
  imports: [CommonModule, PageHeader],
  templateUrl: './doctor-dashboard.html',
  styleUrl: './doctor-dashboard.css',
})
export class DoctorDashboard implements OnInit {

  doctor: any = null;
  appointments: any[] = [];

  constructor(
    private auth: AuthService,
    private appointmentService: AppointmentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getProfile();
    this.getMyAppointments();
  }

  getProfile() {
    this.auth.getProfile().subscribe({
      next: (res: any) => {
        this.doctor = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log("PROFILE ERROR:", err);
      }
    });
  }

  getMyAppointments() {
    this.appointmentService.getMyAppointments().subscribe({
      next: (res: any) => {
        this.appointments = res.data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log("DOCTOR APPOINTMENTS ERROR:", err);
      }
    });
  }
}