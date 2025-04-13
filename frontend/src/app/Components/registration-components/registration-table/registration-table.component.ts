import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../../../services/registration-controller.service';
import { Registration } from '../../../models/Registration';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../dialog/cofirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';
//import {RegistrationDialogComponent} from '../../../dialog/registration-dialog/registration-dialog.component';
import { AuthService } from '../../../services/auth.service';
import {Room} from '../../../models/Room';
@Component({
  selector: 'app-registration-table',
  templateUrl: './registration-table.component.html',
  styleUrls: ['../../../../styles/tables.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class RegistrationTableComponent implements OnInit {
  data: Registration[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;



  constructor(private registrationService: RegistrationService, private dialog: MatDialog, public authService: AuthService) {
  }

  ngOnInit(): void {
    this.loadRegistrations();
  }

  loadRegistrations(): void {
    this.registrationService.getRegistrations(this.currentPage, this.pageSize).subscribe(response => {
      console.log('Server response:', response);
      this.data = response.registrations.map(registration => ({
        ...registration,
        expanded: false
      }));
      this.totalItems = response.total ?? 0;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    }, error => {
      console.error('Error loading registrations:', error);
    });
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

  deleteRegistration(registrationId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Підтвердження видалення',
        message: 'Ви дійсно хочете видалити цю реєстрацію?',
        confirmText: 'Так',
        cancelText: 'Ні'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Результат діалогу:', result);

      if (result) {
        console.log('Викликаємо deleteRegistration() в сервісі');
        this.registrationService.deleteRegistration(registrationId).subscribe(() => {
          this.loadRegistrations();
        });
      }
    });
  }

  /* addRegistration(): void {
     const dialogRef = this.dialog.open(RegistrationDialogComponent);
     dialogRef.afterClosed().subscribe(result => {
       if (result) this.loadRegistrations();
     });
   }

   updateRegistration(registration: Registration): void {
     const dialogRef = this.dialog.open(RegistrationDialogComponent);
     dialogRef.componentInstance.setChairForEdit(registration);
     dialogRef.afterClosed().subscribe(result => {
       if (result) this.loadRegistrations();
     });
 }*/

}
