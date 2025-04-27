import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../../../services/registration-controller.service';
import { Registration } from '../../../models/Registration';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../dialog/cofirm-dialog/confirm-dialog.component';
import { RegistrationDialogComponent } from '../../../dialog/registration-dialog/registration-dialog.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-registration-table',
  templateUrl: './registration-table.component.html',
  styleUrls: ['../../../../styles/tables.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class RegistrationTableComponent implements OnInit {
  data: Registration[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  searchQuery: string = '';

  constructor(
    private registrationService: RegistrationService,
    private dialog: MatDialog,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadRegistrations();
  }

  loadRegistrations(): void {
    this.registrationService.getRegistrations(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        console.log('Server response:', response);
        this.data = response.registrations.map(registration => ({
          ...registration,
          expanded: false
        }));
        this.totalItems = response.total ?? 0;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      },
      error: (error) => {
        console.error('Error loading registrations:', error);
      }
    });
  }

  searchRegistrations(): void {
    if (!this.searchQuery.trim()) {
      this.loadRegistrations();
      return;
    }

    this.registrationService.searchRegistrations(this.searchQuery, this.currentPage, this.pageSize).subscribe(
      response => {
        this.data = response.registrations.map(registration => ({
          ...registration,
          expanded: false
        }));
        this.totalItems = response.total ?? 0;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      },
      error => {
        console.error('Error searching registrations:', error);
      }
    );
  }

  resetSearch(): void {
    this.searchQuery = '';
    this.currentPage = 1;
    this.loadRegistrations();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadRegistrations();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadRegistrations();
    }
  }

  toggleDetails(item: Registration): void {
    item.expanded = !item.expanded;
  }

  deleteRegistration(registrationId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Підтвердження видалення',
        message: 'Ви дійсно хочете видали реєстрацію?',
        confirmText: 'Так',
        cancelText: 'Ні'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Результат діалогу:', result);
      if (result) {
        console.log('Викликаємо deleteRegistration() для:', registrationId);
        this.registrationService.deleteRegistration(registrationId).subscribe({
          next: () => {
            this.loadRegistrations();
          },
          error: (err) => {
            console.error('Помилка видалення:', err);
          }
        });
      }
    });
  }

  addRegistration(): void {
    const dialogRef = this.dialog.open(RegistrationDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Додано реєстрацію:', result);
        this.loadRegistrations();
      }
    });
  }
}
