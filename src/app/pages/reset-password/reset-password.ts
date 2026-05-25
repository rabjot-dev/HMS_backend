import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PageHeader } from '../../shared/page-header/page-header';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-reset-password',
  imports: [
    FormsModule,
    PageHeader
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {

  email = localStorage.getItem("resetEmail") || '';
  oldPassword = '';
  newPassword = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  resetPassword() {
    const body = {
      email: this.email,
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    };

    this.auth.resetTemporaryPassword(body).subscribe({
      next: (res: any) => {
        alert(res.message);

        this.auth.logout();

        this.router.navigate(['/login']);
      },

      error: (err) => {
        alert(err.error.message);
      }
    });
  }
}