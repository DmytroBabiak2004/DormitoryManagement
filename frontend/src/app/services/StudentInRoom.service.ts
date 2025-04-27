import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentInRoom } from '../models/StudentInRoom'; // Імпортуємо модель для меблів

@Injectable({
  providedIn: 'root'
})
export class StudentInRoomService {
  private apiUrl = 'http://localhost:5073/api/StudentsInRoom';

  constructor(private http: HttpClient) {}

  // Отримуємо авторизаційні заголовки
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Отримуємо токен з localStorage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getStudentInRoom(roomNumber: string, page: number = 1, pageSize: number = 10): Observable<{ status: string, data: StudentInRoom[], total: number, currentPage: number, pageSize: number }> {
    const url = `${this.apiUrl}/${roomNumber}?page=${page}&pageSize=${pageSize}`;
    return this.http.get<{ status: string, data: StudentInRoom[], total: number, currentPage: number, pageSize: number }>(url, { headers: this.getAuthHeaders() });
  }
}
