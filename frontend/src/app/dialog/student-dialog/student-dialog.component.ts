import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NgIf } from '@angular/common';
import { StudentService } from '../../services/student-controller.service';
import { Student } from '../../models/Student';

@Component({
  selector: 'app-student-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, NgIf],
  templateUrl: 'student-dialog.component.html',
  styleUrls: ['../../../styles/dialogs.scss'],
})
export class StudentDialogComponent {
  studentForm: FormGroup;
  editingStudent: any = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<StudentDialogComponent>,
    private studentService: StudentService
  ) {
    this.studentForm = this.fb.group({
      studentNumber: ['', [Validators.required, Validators.pattern(/^TE\d{8}$/)]], // Наприклад, TE12345678
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Zа-яА-ЯіІїЇєЄґҐ\s]+$/)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Zа-яА-ЯіІїЇєЄґҐ\s]+$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+380\d{9}$/)]], // Наприклад, +380981234567
      gender: [null, Validators.required],
      birthDate: ['', [Validators.required, this.dateValidator()]],
    });
  }

  // Валідація дати (не в майбутньому і не раніше 1900 року)
  dateValidator() {
    return (control: any) => {
      const today = new Date();
      const inputDate = new Date(control.value);
      const minDate = new Date('1900-01-01');
      if (inputDate > today || inputDate < minDate) {
        return { invalidDate: true };
      }
      return null;
    };
  }

  setStudentForEdit(student: Student): void {
    this.editingStudent = student;
    this.studentForm.patchValue({
      studentNumber: student.studentNumber,
      firstName: student.firstName,
      lastName: student.lastName,
      phone: student.phone,
      gender: student.gender,
      birthDate: student.birthDate
    });
    this.studentForm.get('studentNumber')?.disable();
  }

  onGenderChange(selectedGender: boolean): void {
    this.studentForm.get('gender')?.setValue(selectedGender);
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      const formValue = this.studentForm.getRawValue();
      const student: Student = { ...formValue };
      if (this.editingStudent) {
        this.studentService.updateStudent(student).subscribe(
          updated => this.dialogRef.close(updated),
          error => console.error('Помилка при редагуванні:', error)
        );
      } else {
        this.studentService.addStudent(student).subscribe(
          created => this.dialogRef.close(created),
          error => console.error('Помилка при створенні:', error)
        );
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
