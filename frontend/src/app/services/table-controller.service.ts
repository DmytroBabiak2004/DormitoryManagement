import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Table, TableDTO} from '../models/Table';
import {Student} from '../models/Student';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private apiUrl = 'http://localhost:5073/api/Tables';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Отримуємо токен із localStorage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getTables(page: number = 1, pageSize: number = 10): Observable<{ tables: Table[], total: number }> {
    const url = `${this.apiUrl}?page=${page}&pageSize=${pageSize}`;
    return this.http.get<{ tables: Table[], total: number }>(url, { headers: this.getAuthHeaders() });
  }

  searchTables(query: string, page: number = 1, pageSize: number = 10): Observable<{ tables: Table[], total: number }> {
    const url = `${this.apiUrl}/search?query=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`;
    return this.http.get<{ tables: Table[], total: number }>(url, { headers: this.getAuthHeaders() });
  }

  addTable(table: TableDTO): Observable<Table> {
    return this.http.post<Table>(this.apiUrl, table, { headers: this.getAuthHeaders() });
  }

  updateTable(table: TableDTO, serialNumber: number): Observable<Table> {
    const url = `${this.apiUrl}/${serialNumber}`;
    return this.http.put<Table>(url, table, { headers: this.getAuthHeaders() });
  }

  deleteTable(serialNumber: number): Observable<void> {
    const url = `${this.apiUrl}/${serialNumber}`;
    return this.http.delete<void>(url, { headers: this.getAuthHeaders() });
  }
}
