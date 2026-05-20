import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  employee: any = null;
  error = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.getProfile();
  }

  getProfile() {
    const token = localStorage.getItem('token');
    this.http.get(`http://localhost:8000/api/profile?t=${Date.now()}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => {
        this.employee = res;
        this.cdr.detectChanges();  // ← force view update
      },
      error: (err) => {
        this.error = 'Failed to load profile';
        this.cdr.detectChanges();
      }
    });
  }
}