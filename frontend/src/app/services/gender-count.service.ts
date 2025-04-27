import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface GenderCountDto {
  gender: boolean;
  studentCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = 'http://localhost:5073/api/StatisticsGender/gender-count'; // змінити за потребою

  constructor(private http: HttpClient) {}

  getGenderStats(): Observable<GenderCountDto[]> {
    return this.http.get<GenderCountDto[]>(this.apiUrl);
  }
}
