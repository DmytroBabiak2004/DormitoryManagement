import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../../services/room-controller.service';
import { Room } from '../../../models/Room';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../dialog/cofirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';
import {RoomDialogComponent} from '../../../dialog/room-dialog/room-dialog.component';  // Додано
import { AuthService } from '../../../services/auth.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
@Component({
  selector: 'app-room-table',
  templateUrl: './room-table.component.html',
  styleUrls: ['../../../../styles/tables.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class RoomTableComponent implements OnInit {
  data: Room[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  searchQuery: string = '';


  constructor(private roomService: RoomService, private dialog: MatDialog, public authService: AuthService) {
  }

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.roomService.getRooms(this.currentPage, this.pageSize).subscribe(response => {
      console.log('Server response:', response);
      this.data = response.rooms.map(room => ({
        ...room,
        expanded: false
      }));
      this.totalItems = response.total ?? 0;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    }, error => {
      console.error('Error loading rooms:', error);
    });
  }

  searchRooms(): void {
    if (!this.searchQuery.trim()) {
      this.loadRooms(); // Якщо пошуковий запит порожній, завантажуємо всі кімнати
      return;
    }

    this.roomService.searchRooms(this.searchQuery, this.currentPage, this.pageSize).subscribe(
      response => {
        this.data = response.rooms.map(room => ({
          ...room,
          expanded: false
        }));
        this.totalItems = response.total ?? 0;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      },
      error => {
        console.error('Error searching rooms:', error);
      }
    );
  }

  resetSearch(): void {
    this.searchQuery = '';
    this.currentPage = 1;
    this.loadRooms();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadRooms();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadRooms();
    }
  }

  toggleDetails(item: Room): void {
    item.expanded = !item.expanded;
  }

  deleteRoom(roomNumber: string): void {
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
        console.log('Викликаємо deleteRoom() в сервісі');
        this.roomService.deleteRoom(roomNumber).subscribe(() => {
          this.loadRooms();
        });
      }
    });
  }

  addRoom(): void {
    const dialogRef = this.dialog.open(RoomDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadRooms();
    });
  }

  updateRoom(room: Room): void {
    const dialogRef = this.dialog.open(RoomDialogComponent);
    dialogRef.componentInstance.setRoomForEdit(room);
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadRooms();
    });
  }

}
