import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:9000/api/auth';

  constructor(private http: HttpClient) {}

  login(body: any) {
    return this.http.post(`${this.apiUrl}/login`, body);
  }

  registerEmployee(body: any) {
    return this.http.post(`${this.apiUrl}/register-employee`, body);
  }

  getProfile() {
    const token = localStorage.getItem("token");

    return this.http.get(`${this.apiUrl}/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  resetTemporaryPassword(body: any) {
    return this.http.post(`${this.apiUrl}/reset-temporary-password`, body);
  }

  saveLoginData(res: any) {
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
  }

  getToken() {
    return localStorage.getItem("token");
  }

  getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  getRole() {
    return this.getUser()?.role;
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("resetEmail");
  }
}