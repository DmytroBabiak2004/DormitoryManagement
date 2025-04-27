import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RoomService } from '../../services/room-controller.service';
import { Room } from '../../models/Room';
import { NgIf, NgForOf } from '@angular/common';

@Component({
  selector: 'app-room-dialog',
  templateUrl: './room-dialog.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgForOf],
  styleUrls: ['../../../styles/dialogs.scss']
})
export class RoomDialogComponent implements OnInit {
  roomForm: FormGroup;
  editingRoom: Room | null = null;
  suffixes = ['a', 'b'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RoomDialogComponent>,
    private roomService: RoomService
  ) {
    this.roomForm = this.fb.group({
      roomNumberDigits: ['', [
        Validators.required,
        Validators.pattern(/^\d{3}$/)
      ]],
      roomNumberSuffix: ['', Validators.required],
      numberOfPlaces: [1, [
        Validators.required,
        Validators.min(1),
        Validators.max(10)
      ]]
    });
  }

  ngOnInit(): void {}

  setRoomForEdit(room: Room): void {
    this.editingRoom = room;
    if (!room.roomNumber.match(/^\d{3}[ab]$/)) {
      console.error('Некоректний формат roomNumber:', room.roomNumber);
      return;
    }
    const digits = room.roomNumber.slice(0, 3);
    const suffix = room.roomNumber.slice(3);
    this.roomForm.patchValue({
      roomNumberDigits: digits,
      roomNumberSuffix: suffix,
      numberOfPlaces: room.numberOfPlaces
    });
    // Блокуємо поля для редагування
    this.roomForm.get('roomNumberDigits')?.disable();
    this.roomForm.get('roomNumberSuffix')?.disable();
  }

  onSubmit(): void {
    if (this.roomForm.valid) {
      const roomData: Room = {
        roomNumber: this.editingRoom
          ? this.editingRoom.roomNumber // Зберігаємо оригінальний roomNumber при редагуванні
          : `${this.roomForm.value.roomNumberDigits}${this.roomForm.value.roomNumberSuffix}`,
        numberOfPlaces: this.roomForm.value.numberOfPlaces,
        expanded: false
      };

      console.log('Надсилаємо дані:', roomData);

      const request = this.editingRoom
        ? this.roomService.updateRoom(roomData)
        : this.roomService.addRoom(roomData);

      request.subscribe({
        next: (result) => {
          console.log('Успішно:', result);
          this.dialogRef.close(result);
        },
        error: (err) => {
          console.error('Помилка:', err);
          // this.snackBar.open(`Помилка: ${err.error?.message || 'Невідома помилка'}`, 'Закрити', { duration: 5000 });
        }
      });
    } else {
      console.log('Форма невалідна:', this.roomForm.errors);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
