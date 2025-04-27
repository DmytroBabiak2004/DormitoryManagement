import { Component, OnInit } from '@angular/core';
import { FurnitureInRoomService } from '../../../services/FurnitureInRoom.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Furniture } from '../../../models/Furniture';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-furniture-in-room-table',
  templateUrl: './furniture-in-room-table.component.html',
  styleUrls: ['../../../../styles/tables.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FurnitureTableComponent implements OnInit {
  data: Furniture[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  roomNumber: string = ''; // Для введення номера кімнати

  constructor(private furnitureInRoomService: FurnitureInRoomService, public authService: AuthService) {}

  ngOnInit(): void {}

  // Завантаження меблів для конкретної кімнати
  searchFurniture(): void {
    if (this.roomNumber.trim()) {
      this.loadFurnitures(this.roomNumber); // Передаємо roomNumber як параметр
    } else {
      alert('Будь ласка, введіть номер кімнати.');
    }
  }

  // Завантаження меблів з бекенду
  loadFurnitures(roomNumber: string): void {
    this.furnitureInRoomService.getFurnitureInRoom(roomNumber, this.currentPage, this.pageSize).subscribe(response => {
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
      this.loadFurnitures(this.roomNumber); // Завантажуємо дані при зміні сторінки
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadFurnitures(this.roomNumber); // Завантажуємо дані при зміні сторінки
    }
  }

  toggleDetails(item: Furniture): void {
    item.expanded = !item.expanded;
  }
}
