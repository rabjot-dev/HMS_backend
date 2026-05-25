import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  name = '';
  email = '';
  phone = '';
  password = '';
  department = '';
  designation = '';
  experience = '';
  qualification = '';
  role = '';

  constructor(private auth: AuthService) {}

  registerEmployee() {
    const body = {
      name: this.name,
      email: this.email,
      phone: this.phone,
      password: this.password,
      department: this.department,
      designation: this.designation,
      experience: this.experience,
      qualification: this.qualification,
      role: this.role,
    };

    this.auth.registerEmployee(body).subscribe({
      next: (res: any) => {
        console.log("REGISTER SUCCESS", res);
        alert(res.message);
      },

      error: (err) => {
        console.log("REGISTER ERROR", err);
        alert(err.error.message);
      }
    });
  }
}