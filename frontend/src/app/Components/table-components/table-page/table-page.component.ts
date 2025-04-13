import { Component } from '@angular/core';
import {TableTableComponent} from '../table-table/table-table.component';

@Component({
  selector: 'app-table-components',
  imports: [
    TableTableComponent
  ],
  templateUrl: './table-page.component.html',
  standalone: true,
  styleUrl: './table-page.component.scss'
})
export class TablesComponent {
}
