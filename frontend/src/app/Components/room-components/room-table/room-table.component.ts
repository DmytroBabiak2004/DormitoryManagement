import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../../services/room-controller.service';
import { Room } from '../../../models/Room';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../dialog/cofirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';
//import {RoomDialogComponent} from '../../../dialog/room-dialog/room-dialog.component';  // Додано
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-room-table',
  templateUrl: './room-table.component.html',
  styleUrls: ['../../../../styles/tables.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class RoomTableComponent implements OnInit {
  data: Room[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;


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

/*  addRoom(): void {
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
  }*/

}
