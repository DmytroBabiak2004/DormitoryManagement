import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Table} from '../models/Table';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private apiUrl = 'https://localhost:44344/api/Tables';

  constructor(private http: HttpClient) {
  }

  getTables(): Observable<Table[]> {
    return this.http.get<Table[]>(this.apiUrl, {headers: {'accept': '*/*'}});
  }
}
