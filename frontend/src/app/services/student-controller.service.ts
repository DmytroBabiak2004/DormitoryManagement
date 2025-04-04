import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Student} from '../models/Student';

@Injectable({
  providedIn: 'root' // Зробить сервіс доступним глобально
})
export class StudentService {
  private apiUrl = 'https://localhost:44344/api/Students';

  constructor(private http: HttpClient) {
  }


  addStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student);
  }


  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl, {headers: {'accept': '*/*'}});
  }


  updateStudent(student: Student): Observable<Student> {
    const url = `${this.apiUrl}/${student.studentNumber}`;
    return this.http.put<Student>(url, student);
  }

  deleteStudent(studentNumber: number): Observable<void> {
    const url = `${this.apiUrl}/${studentNumber}`;
    return this.http.delete<void>(url);
  }
}



