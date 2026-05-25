import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  email = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login() {

    const body = {
      email: this.email,
      password: this.password
    };

    this.auth.login(body).subscribe({

      next: (res: any) => {

        console.log("LOGIN SUCCESS", res);

        this.auth.saveLoginData(res);

        alert(res.message);

        console.log("IS FIRST LOGIN:", res.user.isFirstLogin);

        if (res.user.isFirstLogin === true) {

          localStorage.setItem("resetEmail", res.user.email);

          this.router.navigate(['/reset-password']);

          return;
        }

        if (res.user.role === "ADMIN") {

          this.router.navigate(['/admin-dashboard']);

        }

        else if (res.user.role === "DOCTOR") {

          this.router.navigate(['/doctor-dashboard']);

        }

        else if (res.user.role === "DESK") {

          this.router.navigate(['/receptionist-dashboard']);

        }

        else {

          this.router.navigate(['/employee-dashboard']);

        }

      },

      error: (err) => {

        console.log("LOGIN ERROR", err);

        alert(err.error.message);

      }

    });

  }

}