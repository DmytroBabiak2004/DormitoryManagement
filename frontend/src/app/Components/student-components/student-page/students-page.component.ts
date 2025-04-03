import { Component } from '@angular/core';

import {ResponsiveTableComponent} from '../student-table/student-table.component';

@Component({
  selector: 'app-students-components',
  imports: [
    ResponsiveTableComponent
  ],
  templateUrl: './students-page.component.html',
  standalone: true,
  styleUrl: './students-page.component.scss'
})

export class StudentsComponent {
}
