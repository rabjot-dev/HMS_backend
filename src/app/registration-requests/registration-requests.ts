import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registration-requests.html',
  styleUrl: './registration-requests.css'
})
export class RegistrationRequests implements OnInit {

  requests: any[] = [];
  error = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchRequests();
  }

  fetchRequests() {
    const token = localStorage.getItem('token');
    console.log('FETCHING REQUESTS, TOKEN:', token);
    this.http.get(`http://localhost:8000/api/registration-requests?t=${Date.now()}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => {
        console.log('REQUESTS RESPONSE:', res);
        this.requests = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('REQUESTS ERROR:', err.status, err.error); 
        this.error = 'Failed to fetch requests';
        
      }
    });
  }

  approve(id: string) {
    const token = localStorage.getItem('token');
    this.http.put(`http://localhost:8000/api/registration-requests/${id}/approve`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        alert('Request approved! Login credentials sent to employee.');
        this.fetchRequests();
      },
      error: (err) => alert(err.error?.message || 'Failed to approve')
    });
  }

  reject(id: string) {
    const token = localStorage.getItem('token');
    this.http.put(`http://localhost:8000/api/registration-requests/${id}/reject`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        alert('Request rejected.');
        this.fetchRequests();
      },
      error: (err) => alert(err.error?.message || 'Failed to reject')
    });
  }

  goBack() {
    this.router.navigate(['/admin']);
  }
}