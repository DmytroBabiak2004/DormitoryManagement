import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

// Інтерфейс для відповіді від check-session
interface CheckSessionResponse {
  message: string;
  username: string;
  roles: string[];
}

// Інтерфейс для відповіді від login/register (опціонально)
interface AuthResponse {
  token: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:44344/api/Auth';

  constructor(private http: HttpClient) {}

  // Вхід користувача
  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post(`${this.apiUrl}/login`, body, { headers: { 'Content-Type': 'application/json' } }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          this.saveToken(response.token);
          console.log('Токен збережено:', response.token);
        } else {
          throw new Error('Токен не отримано від сервера');
        }
      }),
      catchError((err) => {
        console.error('Помилка входу:', err);
        throw err; // Перекидаємо помилку для обробки в компоненті
      })
    );
  }

  // Реєстрація користувача
  register(username: string, password: string, role: string): Observable<any> {
    const body = { username, password, role };
    return this.http.post(`${this.apiUrl}/register`, body, { headers: { 'Content-Type': 'application/json' } }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          this.saveToken(response.token);
          console.log('Токен збережено після реєстрації:', response.token);
        } else {
          throw new Error('Токен не отримано від сервера');
        }
      }),
      catchError((err) => {
        console.error('Помилка реєстрації:', err);
        throw err; // Перекидаємо помилку
      })
    );
  }

  // Збереження токену
  saveToken(token: string): void {
    if (token && typeof token === 'string') {
      localStorage.setItem('token', token);
    } else {
      console.error('Некоректний токен:', token);
    }
  }

  // Отримання токену
  getToken(): string | null {
    const token = localStorage.getItem('token');
    return token && token !== 'EROR' ? token : null; // Уникаємо повернення "EROR"
  }

  // Перевірка авторизації
  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token; // Повертає true, якщо токен є і він валідний
  }

  // Вихід із системи
  logout(): void {
    localStorage.removeItem('token');
    console.log('Користувач вийшов із системи');
  }

  checkSession(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      console.warn('Токен відсутній, сесія невалідна');
      return of(false);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<CheckSessionResponse>(`${this.apiUrl}/check-session`, { headers }).pipe(
      map((response) => {
        console.log('Сесія валідна:', response);
        return !!response.username; // Повертаємо true, якщо username є
      }),
      catchError((err) => {
        console.error('Помилка перевірки сесії:', err.status, err.error);
        this.logout();
        return of(false);
      })
    );
  }
  // Отримання ролей з токена
  getUserRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      // Роль може зберігатись під різними ключами
      const roleClaim = payload['role'] || payload['roles'] || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      if (!roleClaim) return [];

      return Array.isArray(roleClaim) ? roleClaim : [roleClaim];
    } catch (err) {
      console.error('Помилка при декодуванні токена:', err);
      return [];
    }
  }

// Чи має користувач вказану роль
  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }

// Чи має хоча б одну з переданих ролей
  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getUserRoles();
    return roles.some(r => userRoles.includes(r));
  }

}
