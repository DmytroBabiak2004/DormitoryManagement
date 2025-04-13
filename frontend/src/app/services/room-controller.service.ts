import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../models/Room';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = 'https://localhost:44344/api/Rooms';

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

  addRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(this.apiUrl, room, { headers: this.getAuthHeaders() });
  }

  updateRoom(room: Room): Observable<Room> {
    const url = `${this.apiUrl}/${room.roomNumber}`;
    return this.http.put<Room>(url, room, { headers: this.getAuthHeaders() });
  }

  deleteRoom(roomNumber: string): Observable<void> {
    const url = `${this.apiUrl}/${roomNumber}`;
    return this.http.delete<void>(url, { headers: this.getAuthHeaders() });
  }
}
