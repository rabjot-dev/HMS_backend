import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [],
  templateUrl: './admin-home.html',
  styleUrl: './admin-home.css'
})
export class AdminHome {

  constructor(private router: Router) {}

  goToDashboard() {
    this.router.navigate(['/admin-dashboard']);
  }

  goToRegisterEmployee() {
    this.router.navigate(['/signup']);
  }

  goToAppointments() {
    this.router.navigate(['/appointments']);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}