import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
})
export class Signup implements OnInit {

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
  isAdmin = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute  // ← added
  ) {}

  ngOnInit() {
    const mode = this.route.snapshot.queryParams['mode'];
    if (mode === 'self') {
      this.isAdmin = false;  // home page register → always self-registration
    } else {
      this.isAdmin = this.checkIfAdmin();  // admin panel → check token
    }
    console.log('MODE:', mode, '| IS ADMIN:', this.isAdmin);
  }

  checkIfAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role?.toLowerCase() === 'admin';
    } catch {
      return false;
    }
  }

  signup() {
    const body = {
      email: this.email,
      name: this.name,
      phone: this.phone,
      department: this.department,
      designation: this.designation,
      role: this.role,
      specialisation: this.specialisation,
      medical_reg_number: this.medical_reg_number,
      status: this.status,
      password: this.password 
    };

    if (this.isAdmin) {
      const token = localStorage.getItem('token');
      this.http.post('http://localhost:8000/api/signup', body, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: (res: any) => {
          alert('Employee Created Successfully!');
          this.router.navigate(['/admin']);
        },
        error: (err) => alert(err.error?.message || 'Signup failed')
      });
    } else {
      this.http.post('http://localhost:8000/api/register-request', body).subscribe({
        next: (res: any) => {
          alert('Registration request submitted! You will receive login credentials via email once approved.');
          this.router.navigate(['/login']);
        },
        error: (err) => alert(err.error?.message || 'Request failed')
      });
    }
  }
}