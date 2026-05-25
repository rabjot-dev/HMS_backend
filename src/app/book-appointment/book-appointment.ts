import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './book-appointment.html',
  styleUrl: './book-appointment.css'
})
export class BookAppointment implements OnInit {

  patients: any[] = [];
  doctors: any[] = [];
  filteredPatients: any[] = [];

  patientSearch = '';
  selectedPatient: any = null;
  selectedDoctorId = '';
  date = '';
  startTime = '';
  endTime = '';
  disease = '';
  notes = '';
  error = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchPatients();
    this.fetchDoctors();
  }

  fetchPatients() {
    const token = localStorage.getItem('token');
    this.http.get(`http://localhost:8000/api/patients?t=${Date.now()}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => {
        this.patients = res.data;
        this.filteredPatients = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to fetch patients', err)
    });
  }

  fetchDoctors() {
    const token = localStorage.getItem('token');
    this.http.get(`http://localhost:8000/api/doctors?t=${Date.now()}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => {
        this.doctors = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to fetch doctors', err)
    });
  }

  searchPatient() {
    const q = this.patientSearch.toLowerCase();
    this.filteredPatients = this.patients.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.phone?.includes(q) ||
      p.UHID?.toLowerCase().includes(q)
    );
    this.cdr.detectChanges();
  }

  selectPatient(patient: any) {
    this.selectedPatient = patient;
    this.patientSearch = `${patient.name} (${patient.UHID})`;
    this.filteredPatients = [];
    this.cdr.detectChanges();
  }

  bookAppointment() {
    if (!this.selectedPatient) {
      alert('Please select a patient');
      return;
    }
    if (!this.selectedDoctorId) {
      alert('Please select a doctor');
      return;
    }
    if (!this.date) {
      alert('Please select a date');
      return;
    }

    const token = localStorage.getItem('token');
    const body = {
      patientId: this.selectedPatient._id,
      doctorEmployeeId: this.selectedDoctorId,
      date: this.date,
      timeSlot: {
        startTime: this.startTime,
        endTime: this.endTime
      },
      disease: this.disease,
      notes: this.notes
    };

    this.http.post('http://localhost:8000/api/appointments', body, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => {
        alert(`Appointment booked! ID: ${res.appointment.appointmentId}`);
        this.router.navigate(['/view-appointments']);
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to book appointment');
      }
    });
  }

  goBack() {
    this.router.navigate(['/receptionist']);
  }
}