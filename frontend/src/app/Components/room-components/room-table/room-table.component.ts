import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RoomService} from '../../../services/room-controller.service';
import {Room} from '../../../models/Room';

@Component({
  selector: 'app-responsive-table',
  standalone: true,
  imports: [CommonModule],
  providers: [RoomService], // Додаємо сервіс як провайдер
  templateUrl: './room-table.component.html',
  styleUrls: ['../../../../styles/tables.scss']
})
export class ResponsiveTableComponent implements OnInit {
  data: Room[] = []; // Ініціалізуємо порожнім масивом
  isLoading: boolean = true; // Індикатор завантаження
  error: string | null = null; // Для обробки помилок

  constructor(private roomService: RoomService) {
  }

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.roomService.getRooms().subscribe({
      next: (rooms) => {
        // Мапимо дані, додаючи поле expanded
        this.data = rooms.map(room => ({
          ...room,
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

  toggleDetails(item: Room) {
    item.expanded = !item.expanded;
  }
}



