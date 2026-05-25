import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeader } from '../../shared/page-header/page-header';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-employee-dashboard',
  imports: [
    CommonModule,
    PageHeader
  ],
  templateUrl: './employee-dashboard.html',
  styleUrl: './employee-dashboard.css',
})
export class EmployeeDashboard implements OnInit {

  employee: any = null;

  constructor(
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile() {
    this.auth.getProfile().subscribe({
      next: (res: any) => {
        console.log("PROFILE:", res);
        this.employee = res.data;
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.log("PROFILE ERROR:", err);
      }
    });
  }
}