import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Registration } from '../models/Registration';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = 'https://localhost:44344/api/Registrations';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Отримуємо токен із localStorage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getRegistrations(page: number = 1, pageSize: number = 10): Observable<{ registrations: Registration[], total: number }> {
    const url = `${this.apiUrl}?page=${page}&pageSize=${pageSize}`;
    return this.http.get<{ registrations: Registration[], total: number }>(url, { headers: this.getAuthHeaders() });
  }

  addRegistration(registration: Registration): Observable<Registration> {
    return this.http.post<Registration>(this.apiUrl, registration, { headers: this.getAuthHeaders() });
  }

  updateRegistration(registration: Registration): Observable<Registration> {
    const url = `${this.apiUrl}/${registration.registrationId}`;
    return this.http.put<Registration>(url, registration, { headers: this.getAuthHeaders() });
  }

  deleteRegistration(registrationId: string): Observable<void> {
    const url = `${this.apiUrl}/${registrationId}`;
    return this.http.delete<void>(url, { headers: this.getAuthHeaders() });
  }
}
