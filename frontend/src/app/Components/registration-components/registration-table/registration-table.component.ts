import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RegistrationService} from '../../../services/registration-controller.service';
import {Registration} from '../../../models/Registration';

@Component({
  selector: 'app-responsive-table',
  standalone: true,
  imports: [CommonModule],
  providers: [RegistrationService], // Додаємо сервіс як провайдер
  templateUrl: './registration-table.component.html',
  styleUrls: ['../../../../styles/tables.scss']
})
export class ResponsiveTableComponent implements OnInit {
  data: Registration[] = []; // Ініціалізуємо порожнім масивом
  isLoading: boolean = true; // Індикатор завантаження
  error: string | null = null; // Для обробки помилок

  constructor(private registrationService: RegistrationService) {
  }

  ngOnInit(): void {
    this.loadRegistrations();
  }

  loadRegistrations(): void {
    this.registrationService.getRegistrations().subscribe({
      next: (registrations) => {
        // Мапимо дані, додаючи поле expanded
        this.data = registrations.map(registration => ({
          ...registration,
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

  toggleDetails(item: Registration) {
    item.expanded = !item.expanded;
  }
}



