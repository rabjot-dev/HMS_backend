import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = 'http://localhost:9000/api';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

  getAllEmployees() {
    return this.http.get(
      `${this.apiUrl}/users/employees`,
      this.getHeaders()
    );
  }

  createEmployee(body: any) {
    return this.http.post(
      `${this.apiUrl}/users/create-employee`,
      body,
      this.getHeaders()
    );
  }

  getPendingRequests() {
    return this.http.get(
      `${this.apiUrl}/employee-signups/pending`,
      this.getHeaders()
    );
  }

  approveRequest(id: string) {
    return this.http.post(
      `${this.apiUrl}/employee-signups/${id}/approve`,
      {},
      this.getHeaders()
    );
  }

  rejectRequest(id: string) {
    return this.http.post(
      `${this.apiUrl}/employee-signups/${id}/reject`,
      {
        rejectionReason: "Rejected by admin"
      },
      this.getHeaders()
    );
  }
}