import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-dashboard.html',
  styleUrl: './patient-dashboard.css'
})
export class PatientDashboard implements OnInit {

  patients: any[] = [];
  filteredPatients: any[] = [];
  searchQuery = '';
  showModal = false;
  editPatient: any = {};
  error = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchPatients();
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
      error: (err) => {
        this.error = 'Failed to fetch patients';
        console.error(err);
      }
    });
  }

  search() {
    const q = this.searchQuery.toLowerCase();
    this.filteredPatients = this.patients.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.phone?.includes(q) ||
      p.UHID?.toLowerCase().includes(q)
    );
    this.cdr.detectChanges();
  }

  openEdit(patient: any) {
    this.editPatient = { ...patient };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editPatient = {};
  }

  savePatient() {
    const token = localStorage.getItem('token');
    this.http.put(`http://localhost:8000/api/patients/${this.editPatient._id}`, {
      name: this.editPatient.name,
      phone: this.editPatient.phone,
      email: this.editPatient.email,
      gender: this.editPatient.gender,
      dob: this.editPatient.dob,
      address: this.editPatient.address,
      emergencyContact: this.editPatient.emergencyContact
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        alert('Patient updated successfully!');
        this.closeModal();
        this.fetchPatients();
      },
      error: (err) => alert(err.error?.message || 'Failed to update patient')
    });
  }

  goBack() {
    this.router.navigate(['/admin']);
  }

  goToAddPatient() {
    this.router.navigate(['/add-patient']);
  }
}