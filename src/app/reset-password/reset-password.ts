import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPasswordComponent {
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  constructor(private http: HttpClient, private router: Router) {}

  resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const token = localStorage.getItem('token');

    this.http.post('http://localhost:8000/api/reset-password', {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => {
        alert('Password reset successfully! Please login again.');
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to reset password');
      }
    });
  }
}