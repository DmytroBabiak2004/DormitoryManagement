import { Component } from '@angular/core';
import {FurnitureTableComponent} from '../furniture-in-room-table/furniture-in-room-table.component';

@Component({
  selector: 'app-furniture-in-room-page',
  imports: [FurnitureTableComponent],
  templateUrl: './furniture-in-room-page.component.html',
  standalone: true,
  styleUrl: './furniture-in-room-page.component.scss'
})
export class FurnitureComponent {

}
