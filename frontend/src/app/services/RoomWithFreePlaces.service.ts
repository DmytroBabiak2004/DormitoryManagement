import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {RoomWithFreePlaces} from '../models/RoomWithFreePlaces';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class RoomWithFreePlacesService {
  private apiUrl = 'http://localhost:5073/api/RoomsWithFreePlaces';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Отримуємо токен із localStorage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  getRoomsWithFreePlaces(page: number = 1, pageSize: number = 10): Observable<{ roomsWithFreePlaces: RoomWithFreePlaces[], total: number }> {
    const url = `${this.apiUrl}?page=${page}&pageSize=${pageSize}`;
    return this.http.get<any>(url, { headers: this.getAuthHeaders() }).pipe(
      map(response => ({
        roomsWithFreePlaces: response.data,
        total: response.total
      }))
    );
  }
}

