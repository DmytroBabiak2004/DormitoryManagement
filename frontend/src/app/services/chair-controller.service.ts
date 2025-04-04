import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Chair} from '../models/Chair';

@Injectable({
  providedIn: 'root' // Зробить сервіс доступним глобально
})
export class ChairService {
  private apiUrl = 'https://localhost:44344/api/Chairs';

  constructor(private http: HttpClient) {
  }


  addChair(chair: Chair): Observable<Chair> {
    return this.http.post<Chair>(this.apiUrl, chair);
  }


  getChairs(): Observable<Chair[]> {
    return this.http.get<Chair[]>(this.apiUrl, {headers: {'accept': '*/*'}});
  }


  updateChair(chair: Chair): Observable<Chair> {
    const url = `${this.apiUrl}/${chair.serialNumber}`;
    return this.http.put<Chair>(url, chair);
  }

  deleteChair(serialNumber: number): Observable<void> {
    const url = `${this.apiUrl}/${serialNumber}`;
    return this.http.delete<void>(url);
  }
}
