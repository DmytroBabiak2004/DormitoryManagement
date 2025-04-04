import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Table} from '../models/Table';

@Injectable({
  providedIn: 'root' // Зробить сервіс доступним глобально
})
export class TableService {
  private apiUrl = 'https://localhost:44344/api/Tables';

  constructor(private http: HttpClient) {
  }


  addTable(table: Table): Observable<Table> {
    return this.http.post<Table>(this.apiUrl, table);
  }


  getTables(): Observable<Table[]> {
    return this.http.get<Table[]>(this.apiUrl, {headers: {'accept': '*/*'}});
  }


  updateTable(table: Table): Observable<Table> {
    const url = `${this.apiUrl}/${table.serialNumber}`;
    return this.http.put<Table>(url, table);
  }

  deleteTable(serialNumber: number): Observable<void> {
    const url = `${this.apiUrl}/${serialNumber}`;
    return this.http.delete<void>(url);
  }
}
