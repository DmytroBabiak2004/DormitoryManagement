import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Chair} from '../models/Chair';

@Injectable({
  providedIn: 'root'
})
export class ChairService {
  private apiUrl = 'https://localhost:44344/api/Chairs';

  constructor(private http: HttpClient) {
  }

  getChairs(): Observable<Chair[]> {
    return this.http.get<Chair[]>(this.apiUrl, {headers: {'accept': '*/*'}});
  }
}
