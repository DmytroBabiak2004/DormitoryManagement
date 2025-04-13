import { Component } from '@angular/core';
import {RoomTableComponent} from '../room-table/room-table.component';

@Component({
  selector: 'app-room-components',
  imports: [
    RoomTableComponent
  ],
  templateUrl: './room-page.component.html',
  standalone: true,
  styleUrl: './room-page.component.scss'
})


export class RoomsComponent {
}
