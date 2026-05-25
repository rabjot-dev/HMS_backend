import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-receptionist-home',
  standalone: true,
  imports: [],
  templateUrl: './receptionist-home.html',
  styleUrl: './receptionist-home.css'
})
export class ReceptionistHome {
  constructor(private router: Router) {}

  goToAddPatient() { this.router.navigate(['/add-patient']); }
  goToBookAppointment() { this.router.navigate(['/book-appointment']); }
  goToViewAppointments() { this.router.navigate(['/view-appointments']); }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}