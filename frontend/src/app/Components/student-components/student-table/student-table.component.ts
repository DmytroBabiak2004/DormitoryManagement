import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../services/student-controller.service';
import { Student } from '../../../models/Student';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../dialog/cofirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';
import {StudentDialogComponent} from '../../../dialog/student-dialog/student-dialog.component';  // Додано
import { AuthService } from '../../../services/auth.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
@Component({
  selector: 'app-student-table',
  templateUrl: './student-table.component.html',
  styleUrls: ['../../../../styles/tables.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class StudentTableComponent implements OnInit {
  data: Student[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  searchQuery: string = '';

  constructor(private studentService: StudentService, private dialog: MatDialog, public authService: AuthService) {
  }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.studentService.getStudents(this.currentPage, this.pageSize).subscribe(response => {
      console.log('Server response:', response);
      this.data = response.students.map(student => ({
        ...student,
        expanded: false
      }));
      this.totalItems = response.total ?? 0;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    }, error => {
      console.error('Error loading students:', error);
    });
  }

  searchStudents(): void {
    if (!this.searchQuery.trim()) {
      this.loadStudents(); // Якщо пошуковий запит порожній, завантажуємо всіх студентів
      return;
    }

    this.studentService.searchStudents(this.searchQuery, this.currentPage, this.pageSize).subscribe(
      response => {
        this.data = response.students.map(student => ({
          ...student,
          expanded: false
        }));
        this.totalItems = response.total ?? 0;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      },
      error => {
        console.error('Error searching students:', error);
      }
    );
  }

  resetSearch(): void {
    this.searchQuery = '';
    this.currentPage = 1;
    this.loadStudents();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadStudents();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadStudents();
    }
  }

  toggleDetails(item: Student): void {
    item.expanded = !item.expanded;
  }

  deleteStudent(studentNumber: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Підтвердження видалення',
        message: 'Ви дійсно хочете видалити цього студента?',
        confirmText: 'Так',
        cancelText: 'Ні'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Результат діалогу:', result);

      if (result) {
        console.log('Викликаємо deleteStudent() в сервісі');
        this.studentService.deleteStudent(studentNumber).subscribe(() => {
          this.loadStudents();
        });
      }
    });
  }

  addStudent(): void {
    const dialogRef = this.dialog.open(StudentDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadStudents();
    });
  }

  updateStudent(student: Student): void {
    const dialogRef = this.dialog.open(StudentDialogComponent);
    dialogRef.componentInstance.setStudentForEdit(student);
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadStudents();
    });
  }

}
