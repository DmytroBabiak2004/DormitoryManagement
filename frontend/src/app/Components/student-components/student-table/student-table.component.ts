import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StudentService} from '../../../services/student-controller.service';
import {Student} from '../../../models/Student';

@Component({
  selector: 'app-responsive-table',
  standalone: true,
  imports: [CommonModule],
  providers: [StudentService], // Додаємо сервіс як провайдер
  templateUrl: './student-table.component.html',
  styleUrls: ['../../../../styles/tables.scss']
})
export class ResponsiveTableComponent implements OnInit {
  data: Student[] = []; // Ініціалізуємо порожнім масивом
  isLoading: boolean = true; // Індикатор завантаження
  error: string | null = null; // Для обробки помилок

  constructor(private studentService: StudentService) {
  }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.studentService.getStudents().subscribe({
      next: (students) => {
        // Мапимо дані, додаючи поле expanded
        this.data = students.map(student => ({
          ...student,
          expanded: false
        }));
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Не вдалося завантажити дані. Спробуйте пізніше.';
        this.isLoading = false;
        console.error('Помилка завантаження:', err);
      }
    });
  }

  toggleDetails(item: Student) {
    item.expanded = !item.expanded;
  }
}



