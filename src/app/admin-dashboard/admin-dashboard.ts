import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {

  employees: any[] = [];
  filteredEmployees: any[] = [];
  selectedRole = 'All';
  roles = ['All', 'Doctor', 'Nurse', 'Admin', 'Receptionist', 'Other'];

  // Edit modal
  showModal = false;
  editEmployee: any = {};

  error = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchEmployees();
  }

  fetchEmployees() {
    const token = localStorage.getItem('token');
    this.http.get(`http://localhost:8000/api/employees?t=${Date.now()}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => {
        this.employees = res.data;
        this.filteredEmployees = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to fetch employees';
        console.log('ERROR:', err);
      }
    });
  }

  filterByRole(role: string) {
    this.selectedRole = role;
    if (role === 'All') {
      this.filteredEmployees = this.employees;
    } else {
      this.filteredEmployees = this.employees.filter(
        emp => emp.designation?.toLowerCase() === role.toLowerCase()
      );
    }
    this.cdr.detectChanges();
  }

  openEdit(employee: any) {
    this.editEmployee = { ...employee }; // clone to avoid mutating original
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editEmployee = {};
  }

  saveEmployee() {
    const token = localStorage.getItem('token');
    this.http.put(`http://localhost:8000/api/employees/${this.editEmployee._id}`, {
      name: this.editEmployee.name,
      phone: this.editEmployee.phone,
      department: this.editEmployee.department,
      designation: this.editEmployee.designation,
      status: this.editEmployee.status
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => {
        alert('Employee updated successfully!');
        this.closeModal();
        this.fetchEmployees(); // refresh list
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to update employee');
      }
    });
  }
}