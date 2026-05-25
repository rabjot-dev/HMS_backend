import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../services/patient';
import { PageHeader } from '../../shared/page-header/page-header';

@Component({
  selector: 'app-register-patient',
  imports: [
    FormsModule,
    CommonModule,
    PageHeader
  ],
  templateUrl: './register-patient.html',
  styleUrl: './register-patient.css',
})
export class RegisterPatient {

  name = '';
  age: number | null = null;
  gender = '';
  phone = '';
  address = '';
  bloodGroup = '';
  allergy = '';

  constructor(
    private patientService: PatientService
  ) {}

  registerPatient() {

    const body = {
      name: this.name,
      age: this.age,
      gender: this.gender,
      phone: this.phone,
      address: this.address,
      bloodGroup: this.bloodGroup,
      allergy: this.allergy
    };

    this.patientService.createPatient(body).subscribe({

      next: (res: any) => {

        console.log("PATIENT CREATED:", res);

        alert(res.message);

      },

      error: (err) => {

        console.log("PATIENT ERROR:", err);

        alert(err.error.message);

      }

    });

  }

}