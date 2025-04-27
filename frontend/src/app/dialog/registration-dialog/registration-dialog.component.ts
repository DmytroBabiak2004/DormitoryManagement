import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RegistrationService } from '../../services/registration-controller.service';
import {Registration, RegistrationDTO} from '../../models/Registration';
import { NgIf } from '@angular/common';
import {ChairDTO} from '../../models/Chair';

@Component({
  selector: 'app-registration-dialog',
  templateUrl: './registration-dialog.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  styleUrls: ['../../../styles/dialogs.scss']
})
export class RegistrationDialogComponent implements OnInit {
  registrationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegistrationDialogComponent>,
    private registrationService: RegistrationService
  ) {
    this.registrationForm = this.fb.group({
      studentNumber: ['', [
        Validators.required,
        Validators.pattern(/^TE\d{8}$/) // TE + 8 цифр
      ]],
      roomNumber: ['', [
        Validators.required,
        Validators.pattern(/^\d{3}[ab]$/) // 3 цифри + a або b
      ]],
      checkInDate: ['', Validators.required], // Обов’язкова дата заселення
      checkOutDate: [''] // Опціональна дата виселення
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.registrationForm.valid) {
      const registrationData: RegistrationDTO = {
        studentNumber: this.registrationForm.value.studentNumber,
        roomNumber: this.registrationForm.value.roomNumber,
        checkInDate: this.registrationForm.value.checkInDate,
        checkOutDate: this.registrationForm.value.checkOutDate || null,
        expanded: false
      };

      console.log('Надсилаємо дані:', registrationData);

      this.registrationService.addRegistration(registrationData).subscribe({
        next: (result) => {
          console.log('Успішно:', result);
          this.dialogRef.close(result);
        },
        error: (err) => {
          console.error('Помилка:', err);
          // this.snackBar.open(`Помилка: ${err.error?.message || 'Невідома помилка'}`, 'Закрити', { duration: 5000 });
        }
      });
    } else {
      console.log('Форма невалідна:', this.registrationForm.errors);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
