import { Component } from '@angular/core';

import {StudentTableComponent} from '../student-table/student-table.component';

@Component({
  selector: 'app-students-components',
  imports: [
    StudentTableComponent
  ],
  templateUrl: './students-page.component.html',
  standalone: true,
  styleUrl: './students-page.component.scss'
})

export class StudentsComponent {
}
