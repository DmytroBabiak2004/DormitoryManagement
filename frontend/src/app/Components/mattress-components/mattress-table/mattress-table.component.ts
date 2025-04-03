import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MattressService} from '../../../services/mattress-controller.service';
import {Mattress} from '../../../models/Mattress';

@Component({
  selector: 'app-responsive-table',
  standalone: true,
  imports: [CommonModule],
  providers: [MattressService], // Додаємо сервіс як провайдер
  templateUrl: './mattress-table.component.html',
  styleUrls: ['../../../../styles/tables.scss']
})
export class ResponsiveTableComponent implements OnInit {
  data: Mattress[] = []; // Ініціалізуємо порожнім масивом
  isLoading: boolean = true; // Індикатор завантаження
  error: string | null = null; // Для обробки помилок

  constructor(private mattressService: MattressService) {
  }

  ngOnInit(): void {
    this.loadMattresses();
  }

  loadMattresses(): void {
    this.mattressService.getMattresses().subscribe({
      next: (mattresses) => {
        // Мапимо дані, додаючи поле expanded
        this.data = mattresses.map(mattress => ({
          ...mattress,
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

  toggleDetails(item: Mattress) {
    item.expanded = !item.expanded;
  }
}



