import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private apiUrl = 'http://localhost:9000/api/appointments';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  createAppointment(body: any) {
    return this.http.post(`${this.apiUrl}/create`, body, this.getHeaders());
  }

  getAllAppointments() {
    return this.http.get(`${this.apiUrl}/all`, this.getHeaders());
  }

  getDoctors() {
    return this.http.get(`${this.apiUrl}/doctors`, this.getHeaders());
  }

  getAvailableSlots(doctorId: string, appointmentDate: string) {
    return this.http.get(
      `${this.apiUrl}/available-slots?doctorId=${doctorId}&appointmentDate=${appointmentDate}`,
      this.getHeaders(),
    );
  }

  updateAppointment(id: string, body: any) {
    return this.http.put(`${this.apiUrl}/${id}`, body, this.getHeaders());
  }

  deleteAppointment(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders());
  }

  getMyAppointments() {
    return this.http.get(`${this.apiUrl}/my-appointments`, this.getHeaders());
  }
}
