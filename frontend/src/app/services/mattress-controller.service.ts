import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Mattress} from '../models/Mattress';

@Injectable({
  providedIn: 'root'
})
export class MattressService {
  private apiUrl = 'https://localhost:44344/api/Mattresses';

  constructor(private http: HttpClient) {
  }

  getMattresses(): Observable<Mattress[]> {
    return this.http.get<Mattress[]>(this.apiUrl, {headers: {'accept': '*/*'}});
  }
}
