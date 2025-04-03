import { Component } from '@angular/core';
import {ResponsiveTableComponent} from '../registration-table/registration-table.component';

@Component({
  selector: 'app-registration-components',
  imports: [
    ResponsiveTableComponent
  ],
  templateUrl: './registration-page.component.html',
  standalone: true,
  styleUrl: './registration-page.component.scss'
})

export class RegistrationsComponent {
}
