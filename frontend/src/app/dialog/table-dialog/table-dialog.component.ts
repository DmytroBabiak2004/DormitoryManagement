import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ChairService } from '../../services/chair-controller.service';
import { Chair, ChairDTO } from '../../models/Chair';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-chair-dialog',
  templateUrl: './chair-dialog.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgForOf],
  styleUrls: ['../../../styles/dialogs.scss']
})
export class ChairDialogComponent implements OnInit {
  chairForm: FormGroup;
  editingChair: Chair | null = null;
  conditions = [
    { id: 1, nameOfCondition: 'New' },
    { id: 2, nameOfCondition: 'Good' },
    { id: 3, nameOfCondition: 'Worn' }
  ];
  types = [
    { id: 1, nameOfChairType: 'Wooden' },
    { id: 2, nameOfChairType: 'Office' },
    { id: 3, nameOfChairType: 'Metal' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ChairDialogComponent>,
    private chairService: ChairService
  ) {
    this.chairForm = this.fb.group({
      typeId: [null, Validators.required],
      conditionId: [null, Validators.required],
      roomNumber: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {}

  setChairForEdit(chair: Chair): void {
    this.editingChair = chair;
    this.chairForm.patchValue({
      conditionId: chair.condition?.id || null,
      typeId: chair.type?.id || null,
      roomNumber: chair.roomNumber
    });
  }

  onSubmit(): void {
    if (this.chairForm.valid) {
      const chairData: ChairDTO = {
        conditionId: this.chairForm.value.conditionId,
        typeId: this.chairForm.value.typeId,
        roomNumber: this.chairForm.value.roomNumber
      };

      const request = this.editingChair
        ? this.chairService.updateChair(chairData, this.editingChair.serialNumber)
        : this.chairService.addChair(chairData);

      request.subscribe({
        next: (result) => {
          this.dialogRef.close(result);
        },
        error: (err) => {
          console.error('Помилка:', err);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
