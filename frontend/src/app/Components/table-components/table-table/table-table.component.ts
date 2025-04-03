import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableService} from '../../../services/table-controller.service';
import {Table} from '../../../models/Table';

@Component({
  selector: 'app-responsive-table',
  standalone: true,
  imports: [CommonModule],
  providers: [TableService], // Додаємо сервіс як провайдер
  templateUrl: './table-table.component.html',
  styleUrls: ['../../../../styles/tables.scss']
})
export class ResponsiveTableComponent implements OnInit {
  data: Table[] = []; // Ініціалізуємо порожнім масивом
  isLoading: boolean = true; // Індикатор завантаження
  error: string | null = null; // Для обробки помилок

  constructor(private tableService: TableService) {
  }

  ngOnInit(): void {
    this.loadTables();
  }

  loadTables(): void {
    this.tableService.getTables().subscribe({
      next: (tables) => {
        // Мапимо дані, додаючи поле expanded
        this.data = tables.map(table => ({
          ...table,
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

  toggleDetails(item: Table) {
    item.expanded = !item.expanded;
  }
}



