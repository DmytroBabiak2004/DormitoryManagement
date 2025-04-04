import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Room} from '../models/Room';

@Injectable({
  providedIn: 'root' // Зробить сервіс доступним глобально
})
export class RoomService {
  private apiUrl = 'https://localhost:44344/api/Rooms';

  constructor(private http: HttpClient) {
  }


  addRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(this.apiUrl, room);
  }


  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiUrl, {headers: {'accept': '*/*'}});
  }


  updateRoom(room: Room): Observable<Room> {
    const url = `${this.apiUrl}/${room.roomNumber}`;
    return this.http.put<Room>(url, room);
  }

  deleteRoom(roomNumber: number): Observable<void> {
    const url = `${this.apiUrl}/${roomNumber}`;
    return this.http.delete<void>(url);
  }
}
