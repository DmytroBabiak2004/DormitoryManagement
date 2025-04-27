import { Component } from '@angular/core';
import {RoomWithFreePlacesTableComponent} from '../room-with-free-places-table/room-with-free-places-table.component';

@Component({
  selector: 'app-room-with-free-places-page',
  imports: [RoomWithFreePlacesTableComponent],
  templateUrl: './room-with-free-places-page.component.html',
  standalone: true,
  styleUrl: './room-with-free-places-page.component.scss'
})
export class RoomWithFreePlacesComponent {

}
