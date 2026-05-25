import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-appointments.html',
  styleUrl: './view-appointments.css'
})
export class ViewAppointments implements OnInit {

  appointments: any[] = [];
  filteredAppointments: any[] = [];
  searchQuery = '';
  selectedStatus = 'ALL';
  statuses = ['ALL', 'BOOKED', 'COMPLETED', 'CANCELLED'];
  error = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchAppointments();
  }

  fetchAppointments() {
    const token = localStorage.getItem('token');
    this.http.get(`http://localhost:8000/api/appointments?t=${Date.now()}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => {
        this.appointments = res.data;
        this.filteredAppointments = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to fetch appointments';
        console.error(err);
      }
    });
  }

  filterByStatus(status: string) {
    this.selectedStatus = status;
    this.applyFilters();
  }

  search() {
    this.applyFilters();
  }

  applyFilters() {
    let result = this.appointments;
    if (this.selectedStatus !== 'ALL') {
      result = result.filter(a => a.status === this.selectedStatus);
    }
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(a =>
        a.patientId?.name?.toLowerCase().includes(q) ||
        a.patientId?.UHID?.toLowerCase().includes(q) ||
        a.doctorEmployeeId?.name?.toLowerCase().includes(q) ||
        a.appointmentId?.toLowerCase().includes(q)
      );
    }
    this.filteredAppointments = result;
    this.cdr.detectChanges();
  }

  updateStatus(id: string, status: string) {
    const token = localStorage.getItem('token');
    this.http.put(`http://localhost:8000/api/appointments/${id}`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.fetchAppointments();
      },
      error: (err) => alert(err.error?.message || 'Failed to update')
    });
  }

  goBack() {
    this.router.navigate(['/receptionist']);
  }

  goToBookAppointment() {
    this.router.navigate(['/book-appointment']);
  }
}