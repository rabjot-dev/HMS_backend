import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
})
export class Signup {

  email = '';
  password = '';
  name = '';
  phone = '';
  department = '';
  designation = '';
  role = '';
  specialisation = '';
  medical_reg_number = '';
  status = 'Active';

  constructor(private http: HttpClient, private router:Router) {}

    signup() {

      const token = localStorage.getItem('token');

      const body = {
        email: this.email,
        password: this.password,
        name: this.name,
        phone: this.phone,
        department: this.department,
        designation: this.designation,
        role: this.role,
        specialisation: this.specialisation,
        medical_reg_number: this.medical_reg_number,
        status: this.status,
      };

      this.http.post(
        'http://localhost:8000/api/signup',
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).subscribe({

        next: (res: any) => {
          console.log('SIGNUP SUCCESS', res);
          alert('Employee Created Successfully');
          this.router.navigate(['/login']);
        },

        error: (err) => {
          console.log('SIGNUP FAILED', err);
          alert(err.error.message);
        },

      });
    }
  }