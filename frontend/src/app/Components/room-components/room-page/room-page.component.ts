import { Component } from '@angular/core';
import {ResponsiveTableComponent} from '../room-table/room-table.component';

@Component({
  selector: 'app-room-components',
  imports: [
    ResponsiveTableComponent
  ],
  templateUrl: './room-page.component.html',
  standalone: true,
  styleUrl: './room-page.component.scss'
})


export class RoomsComponent {
}
