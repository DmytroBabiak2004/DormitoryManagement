import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent {
  public errorMessage: string | null = null;
  public isRegisterMode = false;

  public authForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    role: new FormControl('', { nonNullable: true }) // Без значення за замовчуванням
  });

  constructor(private authService: AuthService, private router: Router) {
    this.toggleFormControls();
  }

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMessage = null;
    this.toggleFormControls();
  }

  toggleFormControls() {
    const roleControl = this.authForm.get('role');
    if (this.isRegisterMode) {
      roleControl?.setValidators([Validators.required]);
      roleControl?.setValue(''); // Скидаємо значення для випадаючого списку
    } else {
      roleControl?.clearValidators();
      roleControl?.setValue('');
    }
    roleControl?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.authForm.invalid) {
      this.errorMessage = 'Заповніть усі поля правильно!';
      return;
    }

    const { username, password, role } = this.authForm.value;

    if (this.isRegisterMode) {
      this.authService.register(username!, password!, role!).subscribe({
        next: () => {
          console.log('Реєстрація успішна');
          this.errorMessage = null;
          this.isRegisterMode = false;
          this.checkSessionAndRedirect();
        },
        error: (err) => {
          console.error('Помилка реєстрації:', err);
          this.errorMessage = err.error?.errors ? err.error.errors[0].description : 'Не вдалося зареєструватися';
        }
      });
    } else {
      this.authService.login(username!, password!).subscribe({
        next: () => {
          console.log('Вхід успішний');
          this.errorMessage = null;
          this.checkSessionAndRedirect();
        },
        error: (err) => {
          console.error('Помилка входу:', err);
          this.errorMessage = 'Невірний логін або пароль';
        }
      });
    }
  }

  private checkSessionAndRedirect() {
    this.authService.checkSession().subscribe({
      next: (isValid) => {
        if (isValid) {
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = 'Сесія невалідна після авторизації';
        }
      },
      error: (err) => {
        console.error('Помилка перевірки сесії:', err);
        this.errorMessage = 'Не вдалося перевірити сесію';
      }
    });
  }
}
