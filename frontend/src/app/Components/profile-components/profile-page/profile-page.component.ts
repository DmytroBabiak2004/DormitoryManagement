import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, UserInfo } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfileComponent implements OnInit {
  public username: string | null = null;
  public role: string | null = null; // Відображаємо першу роль
  public errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    this.authService.checkSession().subscribe({
      next: (isValid: boolean) => {
        if (isValid) {
          const userInfo: UserInfo | null = this.authService.getCurrentUser();
          if (userInfo && userInfo.username) {
            this.username = userInfo.username;
            this.role = userInfo.roles.length > 0 ? userInfo.roles[0] : 'Немає ролі';
          } else {
            this.errorMessage = 'Дані профілю недоступні';
            this.router.navigate(['/login']);
          }
        } else {
          this.errorMessage = 'Сесія невалідна. Будь ласка, увійдіть знову.';
          this.router.navigate(['/login']);
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Помилка перевірки сесії:', err);
        this.errorMessage = err.error?.message || 'Не вдалося перевірити сесію';
        this.router.navigate(['/login']);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
