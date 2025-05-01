import { Component } from '@angular/core';
import {UsersTableComponent} from '../user-table/user-table.component';

@Component({
  selector: 'app-admin-panel-page',
  imports: [
    UsersTableComponent
  ],
  templateUrl: './admin-panel-page.component.html',
  standalone: true,
  styleUrl: './admin-panel-page.component.scss'
})
export class AdminPanelComponent {

}
