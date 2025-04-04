import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Mattress} from '../models/Mattress';

@Injectable({
  providedIn: 'root' // Зробить сервіс доступним глобально
})
export class MattressService {
  private apiUrl = 'https://localhost:44344/api/Mattresses';

  constructor(private http: HttpClient) {
  }

  addMattress(mattress: Mattress): Observable<Mattress> {
    return this.http.post<Mattress>(this.apiUrl, mattress);
  }

  // Отримання списку замовлень
  getMattresses(): Observable<Mattress[]> {
    return this.http.get<Mattress[]>(this.apiUrl, {headers: {'accept': '*/*'}});
  }

  updateMattress(mattress: Mattress): Observable<Mattress> {
    const url = `${this.apiUrl}/${mattress.serialNumber}`;
    return this.http.put<Mattress>(url, mattress);
  }

  deleteMattress(serialNumber: number): Observable<void> {
    const url = `${this.apiUrl}/${serialNumber}`;
    return this.http.delete<void>(url);
  }
}
