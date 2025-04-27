import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import {FormsModule} from '@angular/forms';
import {StudentInRoomService} from '../../../services/StudentInRoom.service';
import {StudentInRoom} from '../../../models/StudentInRoom';

@Component({
  selector: 'app-students-in-room-table',
  templateUrl: './students-in-room-table.component.html',
  styleUrls: ['../../../../styles/tables.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class StudentInRoomTableComponent implements OnInit {
  data: StudentInRoom[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  roomNumber: string = ''; // Для введення номера кімнати

  constructor(private studentInRoomService: StudentInRoomService, public authService: AuthService) {}

  ngOnInit(): void {}

  // Завантаження меблів для конкретної кімнати
  searchStudentInRoom(): void {
    if (this.roomNumber.trim()) {
      this.loadStudentInRoom(this.roomNumber); // Передаємо roomNumber як параметр
    } else {
      alert('Будь ласка, введіть номер кімнати.');
    }
  }

  // Завантаження меблів з бекенду
  loadStudentInRoom(roomNumber: string): void {
    this.studentInRoomService.getStudentInRoom(roomNumber, this.currentPage, this.pageSize).subscribe(response => {
      console.log('Server response:', response);
      this.data = response.data.map(furniture => ({
        ...furniture,
        expanded: false
      }));
      this.totalItems = response.total ?? 0;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    }, error => {
      console.error('Error loading furniture:', error);
    });
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadStudentInRoom(this.roomNumber); // Завантажуємо дані при зміні сторінки
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadStudentInRoom(this.roomNumber); // Завантажуємо дані при зміні сторінки
    }
  }

  toggleDetails(item: StudentInRoom): void {
    item.expanded = !item.expanded;
  }
}
