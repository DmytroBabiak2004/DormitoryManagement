import { Component } from '@angular/core';
import {MattressTableComponent} from '../mattress-table/mattress-table.component';

@Component({
  selector: 'app-mattress-components',
  imports: [
    MattressTableComponent
  ],
  templateUrl: './mattress-page.component.html',
  standalone: true,
  styleUrl: './mattress-page.component.scss'
})

export class MattressesComponent {
}
