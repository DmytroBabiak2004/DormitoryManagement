import { Component } from '@angular/core';
import {StudentInRoomTableComponent} from '../students-in-room-table/students-in-room-table.component';

@Component({
  selector: 'app-students-in-room-page',
  imports: [
    StudentInRoomTableComponent
  ],
  templateUrl: './students-in-room-page.component.html',
  standalone: true,
  styleUrl: './students-in-room-page.component.scss'
})
export class StudentsInRoomComponent {

}
