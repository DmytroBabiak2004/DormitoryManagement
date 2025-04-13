import { Component } from '@angular/core';
import {ChairTableComponent} from '../chair-table/chair-table.component';

@Component({
  selector: 'app-chair-components',
  imports: [
    ChairTableComponent
  ],
  templateUrl: './chair-page.component.html',
  standalone: true,
  styleUrl: 'chair-page.component.scss'
})

export class ChairsComponent {
}
