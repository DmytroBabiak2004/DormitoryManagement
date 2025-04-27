import { Component, OnInit } from '@angular/core';
import { TableService } from '../../../services/table-controller.service';
import { Table } from '../../../models/Table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../dialog/cofirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';
import {TableDialogComponent} from '../../../dialog/table-dialog/table-dialog.component';  // Додано
import { AuthService } from '../../../services/auth.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
@Component({
  selector: 'app-table-table',
  templateUrl: './table-table.component.html',
  styleUrls: ['../../../../styles/tables.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class TableTableComponent implements OnInit {
  data: Table[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  searchQuery: string = '';


  constructor(private tableService: TableService, private dialog: MatDialog, public authService: AuthService) {
  }

  ngOnInit(): void {
    this.loadTables();
  }

  loadTables(): void {
    this.tableService.getTables(this.currentPage, this.pageSize).subscribe(response => {
      console.log('Server response:', response);
      this.data = response.tables.map(table => ({
        ...table,
        expanded: false
      }));
      this.totalItems = response.total ?? 0;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    }, error => {
      console.error('Error loading tables:', error);
    });
  }

  searchTables(): void {
    if (!this.searchQuery.trim()) {
      this.loadTables();
      return;
    }

    this.tableService.searchTables(this.searchQuery, this.currentPage, this.pageSize).subscribe(
      response => {
        this.data = response.tables.map(table => ({
          ...table,
          expanded: false
        }));
        this.totalItems = response.total ?? 0;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      },
      error => {
        console.error('Error searching tables:', error);
      }
    );
  }

  resetSearch(): void {
    this.searchQuery = '';
    this.currentPage = 1;
    this.loadTables();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadTables();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadTables();
    }
  }

  toggleDetails(item: Table): void {
    item.expanded = !item.expanded;
  }

  deleteTable(serialNumber: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Підтвердження видалення',
        message: 'Ви дійсно хочете видалити цей cтіл?',
        confirmText: 'Так',
        cancelText: 'Ні'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Результат діалогу:', result);

      if (result) {
        console.log('Викликаємо deleteTable() в сервісі');
        this.tableService.deleteTable(serialNumber).subscribe(() => {
          this.loadTables();
        });
      }
    });
  }

  addTable(): void {
    const dialogRef = this.dialog.open(TableDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadTables();
    });
  }

  updateTable(table: Table): void {
    const dialogRef = this.dialog.open(TableDialogComponent);
    dialogRef.componentInstance.setTableForEdit(table);
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadTables();
    });
  }

}
