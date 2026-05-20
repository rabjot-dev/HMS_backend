import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = '';
  password = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login() {

    const body = {
      email: this.email,
      password: this.password
    };

    this.http.post('http://localhost:8000/api/login', body)
    .subscribe({

      next: (res: any) => {

  console.log("LOGIN RESPONSE:", res);

  localStorage.setItem('token', res.token);

  // ADMIN LOGIN
  if (res.role?.toLowerCase() === 'admin') {
  this.router.navigate(['/admin']);
}

  // FIRST LOGIN EMPLOYEE
  else if (res.isFirstLogin) {

    this.router.navigate(['/reset-password']);

  }

  // NORMAL EMPLOYEE
  else {

    this.router.navigate(['/profile']);

  }

},

    });

  }

}