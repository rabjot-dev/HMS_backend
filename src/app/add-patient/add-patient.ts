import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-patient.html',
  styleUrl: './add-patient.css'
})
export class AddPatient {
  name = '';
  phone = '';
  email = '';
  gender = '';
  dob = '';
  address = '';
  emergencyName = '';
  emergencyRelationship = '';
  emergencyPhone = '';

  constructor(private http: HttpClient, private router: Router) {}

  addPatient() {
    if (!this.name || !this.phone) {
      alert('Name and phone are required');
      return;
    }

    const token = localStorage.getItem('token');
    const body = {
      name: this.name,
      phone: this.phone,
      email: this.email,
      gender: this.gender,
      dob: this.dob,
      address: this.address,
      emergencyContact: {
        name: this.emergencyName,
        relationship: this.emergencyRelationship,
        phone: this.emergencyPhone
      }
    };

    this.http.post('http://localhost:8000/api/patients', body, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => {
        alert(`Patient added successfully! UHID: ${res.patient.UHID}`);
        this.router.navigate(['/patient-dashboard']);
      },
      error: (err) => alert(err.error?.message || 'Failed to add patient')
    });
  }

  goBack() {
    this.router.navigate(['/admin']);
  }
}