import { Component } from '@angular/core';
import {ResponsiveTableComponent} from '../mattress-table/mattress-table.component';

@Component({
  selector: 'app-mattress-components',
  imports: [
    ResponsiveTableComponent
  ],
  templateUrl: './mattress-page.component.html',
  standalone: true,
  styleUrl: './mattress-page.component.scss'
})

export class MattressesComponent {
}
