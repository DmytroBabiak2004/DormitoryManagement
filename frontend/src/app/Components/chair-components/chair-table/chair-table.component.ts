import { Component, OnInit } from '@angular/core';
import { ChairService } from '../../../services/chair-controller.service';
import { Chair } from '../../../models/Chair';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../dialog/cofirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';
import {ChairDialogComponent} from '../../../dialog/chair-dialog/chair-dialog.component';  // Додано
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-chair-table',
  templateUrl: './chair-table.component.html',
  styleUrls: ['../../../../styles/tables.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ChairTableComponent implements OnInit {
  data: Chair[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;



  constructor(private chairService: ChairService, private dialog: MatDialog, public authService: AuthService) {
  }

  ngOnInit(): void {
    this.loadChairs();
  }

  loadChairs(): void {
    this.chairService.getChairs(this.currentPage, this.pageSize).subscribe(response => {
      console.log('Server response:', response);
      this.data = response.chairs.map(chair => ({
        ...chair,
        expanded: false
      }));
      this.totalItems = response.total ?? 0;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    }, error => {
      console.error('Error loading chairs:', error);
    });
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadChairs();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadChairs();
    }
  }

  toggleDetails(item: Chair): void {
    item.expanded = !item.expanded;
  }

  deleteChair(serialNumber: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Підтвердження видалення',
        message: 'Ви дійсно хочете видалити цей стілець?',
        confirmText: 'Так',
        cancelText: 'Ні'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Результат діалогу:', result);

      if (result) {
        console.log('Викликаємо deleteChair() в сервісі');
        this.chairService.deleteChair(serialNumber).subscribe(() => {
          this.loadChairs();
        });
      }
    });
  }

  addChair(): void {
    const dialogRef = this.dialog.open(ChairDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadChairs();
    });
  }

  updateChair(chair: Chair): void {
    const dialogRef = this.dialog.open(ChairDialogComponent);
    dialogRef.componentInstance.setChairForEdit(chair);
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadChairs();
    });
  }

}
