import { Component, OnInit } from '@angular/core';
import { MattressService } from '../../../services/mattress-controller.service';
import { Mattress } from '../../../models/Mattress';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../dialog/cofirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';
import {MattressDialogComponent} from '../../../dialog/mattress-dialog/mattress-dialog.component';  // Додано
import { AuthService } from '../../../services/auth.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-mattress-table',
  templateUrl: './mattress-table.component.html',
  styleUrls: ['../../../../styles/tables.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class MattressTableComponent implements OnInit {
  data: Mattress[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  searchQuery: string = '';


  constructor(private mattressService: MattressService, private dialog: MatDialog, public authService: AuthService) {
  }

  ngOnInit(): void {
    this.loadMattresses();
  }

  loadMattresses(): void {
    this.mattressService.getMattresses(this.currentPage, this.pageSize).subscribe(response => {
      console.log('Server response:', response);
      this.data = response.mattresses.map(mattress => ({
        ...mattress,
        expanded: false
      }));
      this.totalItems = response.total ?? 0;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    }, error => {
      console.error('Error loading mattresses:', error);
    });
  }

  searchMattresses(): void {
    if (!this.searchQuery.trim()) {
      this.loadMattresses(); // Якщо пошуковий запит порожній, завантажуємо всі матраци
      return;
    }

    this.mattressService.searchMattresses(this.searchQuery, this.currentPage, this.pageSize).subscribe(
      response => {
        this.data = response.mattresses.map(mattress => ({
          ...mattress,
          expanded: false
        }));
        this.totalItems = response.total ?? 0;
        this.totalPages= Math.ceil(this.totalItems / this.pageSize);
      },
      error => {
        console.error('Error searching mattresses:', error);
      }
    );
  }

  resetSearch(): void {
    this.searchQuery = '';
    this.currentPage = 1;
    this.loadMattresses();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadMattresses();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadMattresses();
    }
  }

  toggleDetails(item: Mattress): void {
    item.expanded = !item.expanded;
  }

  deleteMattress(serialNumber: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Підтвердження видалення',
        message: 'Ви дійсно хочете видалити цей матрац?',
        confirmText: 'Так',
        cancelText: 'Ні'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Результат діалогу:', result);

      if (result) {
        console.log('Викликаємо deleteMattress() в сервісі');
        this.mattressService.deleteMattress(serialNumber).subscribe(() => {
          this.loadMattresses();
        });
      }
    });
  }

  addMattress(): void {
    const dialogRef = this.dialog.open(MattressDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadMattresses();
    });
  }

  updateMattress(mattress: Mattress): void {
    console.log('Редагуємо матрац:', mattress);
    const dialogRef = this.dialog.open(MattressDialogComponent);
    dialogRef.componentInstance.setMattressForEdit(mattress);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Результат редагування:', result);
        this.loadMattresses();
      }
    });
  }

}
