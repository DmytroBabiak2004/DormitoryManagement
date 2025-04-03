import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Registration} from '../models/Registration';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = 'https://localhost:44344/api/Registrations';

  constructor(private http: HttpClient) {
  }

  getRegistrations(): Observable<Registration[]> {
    return this.http.get<Registration[]>(this.apiUrl, {headers: {'accept': '*/*'}});
  }
}
