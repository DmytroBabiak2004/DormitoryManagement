import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chair, ChairDTO } from '../models/Chair';

@Injectable({
  providedIn: 'root'
})
export class ChairService {
  private apiUrl = '//localhost:5073/api/Chairs';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getChairs(page: number = 1, pageSize: number = 10): Observable<{ chairs: Chair[], total: number }> {
    const url = `${this.apiUrl}?page=${page}&pageSize=${pageSize}`;
    return this.http.get<{ chairs: Chair[], total: number }>(url, { headers: this.getAuthHeaders() });
  }

  searchChairs(query: string, page: number = 1, pageSize: number = 10): Observable<{ chairs: Chair[], total: number }> {
    const url = `${this.apiUrl}/search?query=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`;
    return this.http.get<{ chairs: Chair[], total: number }>(url, { headers: this.getAuthHeaders() });
  }

  addChair(chair: ChairDTO): Observable<Chair> {
    return this.http.post<Chair>(this.apiUrl, chair, { headers: this.getAuthHeaders() });
  }

  updateChair(chair: ChairDTO, serialNumber: number): Observable<Chair> {
    const url = `${this.apiUrl}/${serialNumber}`;
    return this.http.put<Chair>(url, chair, { headers: this.getAuthHeaders() });
  }

  deleteChair(serialNumber: number): Observable<void> {
    const url = `${this.apiUrl}/${serialNumber}`;
    return this.http.delete<void>(url, { headers: this.getAuthHeaders() });
  }
}
