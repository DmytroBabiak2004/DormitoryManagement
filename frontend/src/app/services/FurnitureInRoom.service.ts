import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Furniture } from '../models/Furniture'; // Імпортуємо модель для меблів

@Injectable({
  providedIn: 'root'
})
export class FurnitureInRoomService {
  private apiUrl = 'http://localhost:5073/api/Furniture';

  constructor(private http: HttpClient) {}

  // Отримуємо авторизаційні заголовки
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Отримуємо токен з localStorage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getFurnitureInRoom(roomNumber: string, page: number = 1, pageSize: number = 10): Observable<{ status: string, data: Furniture[], total: number, currentPage: number, pageSize: number }> {
    const url = `${this.apiUrl}/${roomNumber}?page=${page}&pageSize=${pageSize}`;
    return this.http.get<{ status: string, data: Furniture[], total: number, currentPage: number, pageSize: number }>(url, { headers: this.getAuthHeaders() });
  }
}
