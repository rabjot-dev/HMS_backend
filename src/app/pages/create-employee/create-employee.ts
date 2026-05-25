import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PageHeader } from '../../shared/page-header/page-header';
import { EmployeeService } from '../../services/employee';

@Component({
  selector: 'app-create-employee',
  imports: [
    FormsModule,
    CommonModule,
    PageHeader
  ],
  templateUrl: './create-employee.html',
  styleUrl: './create-employee.css',
})
export class CreateEmployee {

  name = '';
  email = '';
  phone = '';
  department = '';
  designation = '';
  role = 'EMPLOYEE';

  temporaryPassword = '';

  constructor(private employeeService: EmployeeService) {}

  createEmployee() {
    const body = {
      name: this.name,
      email: this.email,
      phone: this.phone,
      department: this.department,
      designation: this.designation,
      role: this.role
    };

    this.employeeService.createEmployee(body).subscribe({
      next: (res: any) => {
        console.log("CREATE EMPLOYEE RESPONSE:", res);
        alert(res.message);
        this.temporaryPassword = res.temporaryPassword;
        console.log("TEMP PASSWORD:", this.temporaryPassword);
      },

      error: (err) => {
        alert(err.error.message);
      }
    });
  }
}