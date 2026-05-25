import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  user: any = null;

  constructor(private router: Router) {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.router.navigate(['/login']);
  }
}