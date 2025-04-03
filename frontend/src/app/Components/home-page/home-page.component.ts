import { Component } from '@angular/core';
import {FooterComponent} from '../footer/footer.component';

@Component({
  selector: 'app-main-page',
  imports: [
    FooterComponent
  ],
  templateUrl: './home-page.component.html',
  standalone: true,
  styleUrl: './home-page.component.scss'
})
export class HomeComponent {

}
