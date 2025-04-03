import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChairService} from '../../../services/chair-controller.service';
import {Chair} from '../../../models/Chair';

@Component({
  selector: 'app-responsive-table',
  standalone: true,
  imports: [CommonModule],
  providers: [ChairService], // Додаємо сервіс як провайдер
  templateUrl: './chair-table.component.html',
  styleUrls: ['./chair-table.component.scss']
})
export class ResponsiveTableComponent implements OnInit {
  data: Chair[] = []; // Ініціалізуємо порожнім масивом
  isLoading: boolean = true; // Індикатор завантаження
  error: string | null = null; // Для обробки помилок

  constructor(private tableService: ChairService) {
  }

  ngOnInit(): void {
    this.loadChairs();
  }

  loadChairs(): void {
    this.tableService.getChairs().subscribe({
      next: (chairs) => {
        // Мапимо дані, додаючи поле expanded
        this.data = chairs.map(chair => ({
          ...chair,
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

  toggleDetails(item: Chair) {
    item.expanded = !item.expanded;
  }
}



