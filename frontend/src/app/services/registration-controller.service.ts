import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {forkJoin, Observable, of, switchMap} from 'rxjs';
import {Registration, RegistrationDTO} from '../models/Registration';
import {map} from 'rxjs/operators';
import {Chair} from '../models/Chair';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = 'http://localhost:5073/api/Registrations';

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
  getAllRegistrations(): Observable<Registration[]> {
    const pageSize = 100; // Розмір сторінки для запитів
    return this.getRegistrations(1, pageSize).pipe(
      switchMap(firstPage => {
        const totalRecords = firstPage.total;
        const totalPages = Math.ceil(totalRecords / pageSize);

        // Якщо всі записи помістилися на першій сторінці
        if (totalPages <= 1) {
          return of(firstPage.registrations);
        }

        // Створюємо масив запитів для всіх сторінок
        const pageRequests: Observable<{ registrations: Registration[], total: number }>[] = [];
        for (let page = 2; page <= totalPages; page++) {
          pageRequests.push(this.getRegistrations(page, pageSize));
        }

        // Виконуємо всі запити паралельно і комбінуємо результати
        return forkJoin(pageRequests).pipe(
          map(pages => {
            // Об'єднуємо всі записи
            const allRegistrations = firstPage.registrations.concat(
              ...pages.map(p => p.registrations)
            );
            return allRegistrations;
          })
        );
      })
    );
  }

  searchRegistrations(query: string, page: number = 1, pageSize: number = 10): Observable<{ registrations: Registration[], total: number }> {
    const url = `${this.apiUrl}/search?query=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`;
    return this.http.get<{ registrations: Registration[], total: number }>(url, { headers: this.getAuthHeaders() });
  }

  addRegistration(registration: RegistrationDTO): Observable<Registration> {
    return this.http.post<Registration>(this.apiUrl, registration, { headers: this.getAuthHeaders() });
  }


  deleteRegistration(registrationId: number): Observable<void> {
    const url = `${this.apiUrl}/${registrationId}`;
    return this.http.delete<void>(url, { headers: this.getAuthHeaders() });
  }

}
