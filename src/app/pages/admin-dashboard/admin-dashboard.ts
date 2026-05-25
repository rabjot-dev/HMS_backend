import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PageHeader } from '../../shared/page-header/page-header';
import { EmployeeService } from '../../services/employee';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    RouterLink,
    PageHeader,
    FormsModule
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {

  employees: any[] = [];
  filteredEmployees: any[] = [];
  requests: any[] = [];

  searchText = '';
  selectedRole = '';

  currentView = 'employees';

  constructor(
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getAllEmployees();
  }

  getAllEmployees() {
    this.currentView = 'employees';

    this.employeeService.getAllEmployees().subscribe({
      next: (res: any) => {
        this.employees = res.data || [];
        this.filteredEmployees = [...this.employees];
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.log("GET EMPLOYEES ERROR", err);
      }
    });
  }

  filterEmployees() {
    const search = this.searchText.toLowerCase();

    this.filteredEmployees = this.employees.filter((emp) => {
      const matchesSearch =
        emp.name?.toLowerCase().includes(search) ||
        emp.email?.toLowerCase().includes(search) ||
        emp.employeeCode?.toLowerCase().includes(search);

      const matchesRole =
        this.selectedRole === '' ||
        emp.role === this.selectedRole;

      return matchesSearch && matchesRole;
    });
  }

  getPendingRequests() {
    this.currentView = 'pending';

    this.employeeService.getPendingRequests().subscribe({
      next: (res: any) => {
        this.requests = res.data || [];
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.log("FETCH REQUEST ERROR", err);
      }
    });
  }

  approveRequest(id: string) {
    this.employeeService.approveRequest(id).subscribe({
      next: (res: any) => {
        alert(res.message);
        this.getPendingRequests();
      },

      error: (err) => {
        alert(err.error.message);
      }
    });
  }

  rejectRequest(id: string) {
    this.employeeService.rejectRequest(id).subscribe({
      next: (res: any) => {
        alert(res.message);
        this.getPendingRequests();
      },

      error: (err) => {
        alert(err.error.message);
      }
    });
  }
}