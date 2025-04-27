import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../models/Room';
import {Registration} from '../models/Registration';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = 'http://localhost:5073/api/Rooms';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Отримуємо токен із localStorage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getRooms(page: number = 1, pageSize: number = 10): Observable<{ rooms: Room[], total: number }> {
    const url = `${this.apiUrl}?page=${page}&pageSize=${pageSize}`;
    return this.http.get<{ rooms: Room[], total: number }>(url, { headers: this.getAuthHeaders() });
  }

  searchRooms(query: string, page: number = 1, pageSize: number = 10): Observable<{ rooms: Room[], total: number }> {
    const url = `${this.apiUrl}/search?query=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`;
    return this.http.get<{ rooms: Room[], total: number }>(url, { headers: this.getAuthHeaders() });
  }

  addRoom(room: Room): Observable<Room> {
    console.log('POST room:', room);
    return this.http.post<Room>(this.apiUrl, room, { headers: this.getAuthHeaders() });
  }

  updateRoom(room: Room): Observable<Room> {
    const url = `${this.apiUrl}/${room.roomNumber}`;
    console.log('PUT room:', url, room);
    return this.http.put<Room>(url, room, { headers: this.getAuthHeaders() });
  }
  deleteRoom(roomNumber: string): Observable<void> {
    const url = `${this.apiUrl}/${roomNumber}`;
    return this.http.delete<void>(url, { headers: this.getAuthHeaders() });
  }
}
