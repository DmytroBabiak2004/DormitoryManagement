import { Component } from '@angular/core';
import {ResponsiveTableComponent} from '../table-table/table-table.component';

@Component({
  selector: 'app-table-components',
  imports: [
    ResponsiveTableComponent
  ],
  templateUrl: './table-page.component.html',
  standalone: true,
  styleUrl: './table-page.component.scss'
})
export class TablesComponent {
}
