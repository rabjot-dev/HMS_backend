import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PatientService } from '../../services/patient';
import { AppointmentService } from '../../services/appointment';
import { PageHeader } from '../../shared/page-header/page-header';

@Component({
  selector: 'app-book-appointment',
  imports: [FormsModule, CommonModule, PageHeader],
  templateUrl: './book-appointment.html',
  styleUrl: './book-appointment.css',
})
export class BookAppointment implements OnInit {

  patients: any[] = [];
  doctors: any[] = [];

  filteredPatients: any[] = [];
  filteredDoctors: any[] = [];

  patientSearch = '';
  doctorSearch = '';

  patientId = '';
  doctorId = '';
  appointmentDate = '';
  timeSlot = '';
  reason = '';

  availableSlots: string[] = [];

  constructor(
    private patientService: PatientService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.getPatients();
    this.getDoctors();
  }

  getPatients() {
    this.patientService.getAllPatients().subscribe({
      next: (res: any) => {
        this.patients = res.data || [];
        this.filteredPatients = [...this.patients];
      },
      error: (err) => {
        console.log("PATIENT FETCH ERROR:", err);
      }
    });
  }

  getDoctors() {
    this.appointmentService.getDoctors().subscribe({
      next: (res: any) => {
        this.doctors = res.data || [];
        this.filteredDoctors = [...this.doctors];
      },
      error: (err) => {
        console.log("DOCTOR FETCH ERROR:", err);
      }
    });
  }

  filterPatients() {
    const search = this.patientSearch.toLowerCase();

    this.filteredPatients = this.patients.filter((patient) =>
      patient.name?.toLowerCase().includes(search) ||
      patient.phone?.toLowerCase().includes(search) ||
      patient.patientCode?.toLowerCase().includes(search)
    );
  }

  filterDoctors() {
    const search = this.doctorSearch.toLowerCase();

    this.filteredDoctors = this.doctors.filter((doctor) =>
      doctor.name?.toLowerCase().includes(search) ||
      doctor.employeeCode?.toLowerCase().includes(search) ||
      doctor.department?.toLowerCase().includes(search)
    );
  }

  getAvailableSlots() {
    if (!this.doctorId || !this.appointmentDate) {
      this.availableSlots = [];
      this.timeSlot = '';
      return;
    }

    this.appointmentService
      .getAvailableSlots(this.doctorId, this.appointmentDate)
      .subscribe({
        next: (res: any) => {
          this.availableSlots = res.data || [];
          this.timeSlot = '';
        },
        error: (err) => {
          console.log("SLOTS ERROR:", err);
        }
      });
  }

  bookAppointment() {
    const body = {
      patientId: this.patientId,
      doctorId: this.doctorId,
      appointmentDate: this.appointmentDate,
      timeSlot: this.timeSlot,
      reason: this.reason
    };

    this.appointmentService.createAppointment(body).subscribe({
      next: (res: any) => {
        alert(
          `${res.message}\nToken No: ${res.data.tokenNo}\nAppointment Code: ${res.data.appointmentCode}`
        );

        this.patientId = '';
        this.doctorId = '';
        this.appointmentDate = '';
        this.timeSlot = '';
        this.reason = '';
        this.patientSearch = '';
        this.doctorSearch = '';
        this.availableSlots = [];
        this.filteredPatients = [...this.patients];
        this.filteredDoctors = [...this.doctors];
      },
      error: (err) => {
        alert(err.error.message);
      }
    });
  }


  
}