import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Registration} from '../models/Registration';

@Injectable({
  providedIn: 'root' // Зробить сервіс доступним глобально
})
export class RegistrationService {
  private apiUrl = 'https://localhost:44344/api/Registrations';

  constructor(private http: HttpClient) {
  }


  addRegistration(registration: Registration): Observable<Registration> {
    return this.http.post<Registration>(this.apiUrl, registration);
  }


  getRegistrations(): Observable<Registration[]> {
    return this.http.get<Registration[]>(this.apiUrl, {headers: {'accept': '*/*'}});
  }


  updateRegistration(registration: Registration): Observable<Registration> {
    const url = `${this.apiUrl}/${registration.registrationId}`;
    return this.http.put<Registration>(url, registration);
  }

  deleteRegistration(registrationId: number): Observable<void> {
    const url = `${this.apiUrl}/${registrationId}`;
    return this.http.delete<void>(url);
  }
}
