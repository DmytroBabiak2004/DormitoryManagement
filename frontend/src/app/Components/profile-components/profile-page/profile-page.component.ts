import { Component } from '@angular/core';
import {AuthorizationComponent} from '../../authorization/authorization.component';

@Component({
  selector: 'app-profile-components',
  imports: [
    AuthorizationComponent
  ],
  templateUrl: './profile-page.component.html',
  standalone: true,
  styleUrl: './profile-page.component.scss'
})

export class ProfileComponent {
}
