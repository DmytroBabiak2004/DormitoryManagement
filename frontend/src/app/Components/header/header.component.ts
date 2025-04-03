import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgClass, } from '@angular/common';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [RouterModule, NgClass],
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isAdmin: boolean = false;
  isUser: boolean = false;
  isMenuOpen: boolean = false;

  constructor() {
    this.checkUserRole();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  handleNavClick(): void {
    // Закриваємо меню лише якщо ширина екрану менша за 770px
    if (window.innerWidth <= 770) {
      this.closeMenu();
    }
  }

  checkUserRole(): void {
    const userRole = localStorage.getItem('userRole');

    if (userRole === 'admin') {
      this.isAdmin = true;
    } else if (userRole === 'user') {
      this.isUser = true;
    }
  }
}
