import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mattress } from '../models/Mattress';

@Injectable({
  providedIn: 'root'
})
export class MattressService {
  private apiUrl = 'https://localhost:44344/api/Matresses';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Отримуємо токен із localStorage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getMattresses(page: number = 1, pageSize: number = 10): Observable<{ mattresses: Mattress[], total: number }> {
    const url = `${this.apiUrl}?page=${page}&pageSize=${pageSize}`;
    return this.http.get<{ mattresses: Mattress[], total: number }>(url, { headers: this.getAuthHeaders() });
  }

  addMattress(mattress: Mattress): Observable<Mattress> {
    return this.http.post<Mattress>(this.apiUrl, mattress, { headers: this.getAuthHeaders() });
  }

  updateMattress(mattress: Mattress): Observable<Mattress> {
    const url = `${this.apiUrl}/${mattress.serialNumber}`;
    return this.http.put<Mattress>(url, mattress, { headers: this.getAuthHeaders() });
  }

  deleteMattress(serialNumber: number): Observable<void> {
    const url = `${this.apiUrl}/${serialNumber}`;
    return this.http.delete<void>(url, { headers: this.getAuthHeaders() });
  }
}
