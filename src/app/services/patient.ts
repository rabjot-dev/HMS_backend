import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiUrl = 'http://localhost:9000/api/patients';

  constructor(private http: HttpClient) {}

  private getHeaders() {

    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

  createPatient(body: any) {
    return this.http.post(
      `${this.apiUrl}/create`,
      body,
      this.getHeaders()
    );
  }

  getAllPatients() {
    return this.http.get(
      `${this.apiUrl}/all`,
      this.getHeaders()
    );
  }
}