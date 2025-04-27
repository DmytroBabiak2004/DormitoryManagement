import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/Student';
import {Room} from '../models/Room';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:5073/api/Students';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Отримуємо токен із localStorage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getStudents(page: number = 1, pageSize: number = 10): Observable<{ students: Student[], total: number }> {
    const url = `${this.apiUrl}?page=${page}&pageSize=${pageSize}`;
    return this.http.get<{ students: Student[], total: number }>(url, { headers: this.getAuthHeaders() });
  }

  searchStudents(query: string, page: number = 1, pageSize: number = 10): Observable<{ students: Student[], total: number }> {
    const url = `${this.apiUrl}/search?query=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`;
    return this.http.get<{ students: Student[], total: number }>(url, { headers: this.getAuthHeaders() });
  }

  addStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student, { headers: this.getAuthHeaders() });
  }

  updateStudent(student: Student): Observable<Student> {
    const url = `${this.apiUrl}/${student.studentNumber}`;
    return this.http.put<Student>(url, student, { headers: this.getAuthHeaders() });
  }

  deleteStudent(studentNumber: string): Observable<void> {
    const url = `${this.apiUrl}/${studentNumber}`;
    return this.http.delete<void>(url, { headers: this.getAuthHeaders() });
  }
}
