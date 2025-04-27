import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MattressService } from '../../services/mattress-controller.service';
import { Mattress, MattressDTO } from '../../models/Mattress';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-mattress-dialog',
  templateUrl: './mattress-dialog.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgForOf],
  styleUrls: ['../../../styles/dialogs.scss']
})
export class MattressDialogComponent implements OnInit {
  mattressForm: FormGroup;
  editingMattress: Mattress | null = null;
  conditions = [
    { id: 1, nameOfCondition: 'New' },
    { id: 2, nameOfCondition: 'Good' },
    { id: 3, nameOfCondition: 'Worn' }
  ];
  types = [
    { id: 1, nameOfMattressType: 'Foam' },
    { id: 2, nameOfMattressType: 'Spring' },
    { id: 3, nameOfMattressType: 'Latex' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MattressDialogComponent>,
    private mattressService: MattressService
  ) {
    this.mattressForm = this.fb.group({
      typeId: [null, Validators.required],
      conditionId: [null, Validators.required],
      studentNumber: ['', [
        Validators.required,
        Validators.pattern(/^TE\d{8}$/) // Формат: TE + 8 цифр
      ]]
    });
  }

  ngOnInit(): void {}

  setMattressForEdit(mattress: Mattress): void {
    this.editingMattress = mattress;
    this.mattressForm.patchValue({
      conditionId: mattress.condition.id,
      typeId: mattress.type.id,
      studentNumber: mattress.studentNumber
    });
  }

  onSubmit(): void {
    if (this.mattressForm.valid) {
      const mattressData: MattressDTO = {
        conditionId: this.mattressForm.value.conditionId,
        typeId: this.mattressForm.value.typeId,
        studentNumber: this.mattressForm.value.studentNumber
      };

      const request = this.editingMattress
        ? this.mattressService.updateMattress(mattressData, this.editingMattress.serialNumber)
        : this.mattressService.addMattress(mattressData);

      request.subscribe({
        next: (result) => {
          this.dialogRef.close(result);
        },
        error: (err) => {
          console.error('Помилка:', err);
          // Додайте повідомлення для користувача, наприклад:
          // this.snackBar.open('Не вдалося додати матрац: ' + err.message, 'Закрити', { duration: 3000 });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
