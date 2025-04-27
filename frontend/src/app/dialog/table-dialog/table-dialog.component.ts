import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TableService } from '../../services/table-controller.service';
import { Table, TableDTO } from '../../models/Table';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-table-dialog',
  templateUrl: './table-dialog.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgForOf],
  styleUrls: ['../../../styles/dialogs.scss']
})
export class TableDialogComponent implements OnInit {
  tableForm: FormGroup;
  editingTable: Table | null = null;
  conditions = [
    { id: 1, nameOfCondition: 'New' },
    { id: 2, nameOfCondition: 'Good' },
    { id: 3, nameOfCondition: 'Worn' }
  ];
  types = [
    { id: 1, nameOfTableType: 'Wooden' },
    { id: 2, nameOfTableType: 'Small' },
    { id: 3, nameOfTableType: 'Metal' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TableDialogComponent>,
    private tableService: TableService
  ) {
    this.tableForm = this.fb.group({
      typeId: [null, Validators.required],
      conditionId: [null, Validators.required],
      roomNumber: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {}

  setTableForEdit(table: Table): void {
    this.editingTable = table;
    this.tableForm.patchValue({
      conditionId: table.condition?.id || null,
      typeId: table.type?.id || null,
      roomNumber: table.roomNumber
    });
  }

  onSubmit(): void {
    if (this.tableForm.valid) {
      const tableData: TableDTO = {
        conditionId: this.tableForm.value.conditionId,
        typeId: this.tableForm.value.typeId,
        roomNumber: this.tableForm.value.roomNumber
      };

      const request = this.editingTable
        ? this.tableService.updateTable(tableData, this.editingTable.serialNumber)
        : this.tableService.addTable(tableData);

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
