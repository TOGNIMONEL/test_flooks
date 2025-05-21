import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Connexion</h1>
          <p>Bienvenue sur notre plateforme d'artisanat</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="email">Email</label>
            <div class="input-group">
              <i class="fas fa-envelope"></i>
              <input 
                type="email" 
                id="email" 
                formControlName="email" 
                placeholder="votre@email.com"
                [class.error]="isFieldInvalid('email')">
            </div>
            @if (isFieldInvalid('email')) {
              <span class="error-message">Email invalide</span>
            }
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <div class="input-group">
              <i class="fas fa-lock"></i>
              <input 
                [type]="showPassword ? 'text' : 'password'" 
                id="password" 
                formControlName="password"
                [class.error]="isFieldInvalid('password')">
              <button 
                type="button" 
                class="toggle-password"
                (click)="togglePasswordVisibility()">
                <i class="fas" [class.fa-eye]="!showPassword" [class.fa-eye-slash]="showPassword"></i>
              </button>
            </div>
            @if (isFieldInvalid('password')) {
              <span class="error-message">Mot de passe requis</span>
            }
          </div>

          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" formControlName="rememberMe">
              <span>Se souvenir de moi</span>
            </label>
            <a routerLink="/auth/reset-password" class="forgot-password">
              Mot de passe oublié ?
            </a>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary btn-block"
            [disabled]="loginForm.invalid || isLoading">
            @if (isLoading) {
              <i class="fas fa-spinner fa-spin"></i>
              Connexion en cours...
            } @else {
              Se connecter
            }
          </button>

          <div class="social-login">
            <p>Ou connectez-vous avec</p>
            <div class="social-buttons">
              <button type="button" class="btn btn-social btn-google">
                <i class="fab fa-google"></i>
                Google
              </button>
              <button type="button" class="btn btn-social btn-facebook">
                <i class="fab fa-facebook-f"></i>
                Facebook
              </button>
            </div>
          </div>
        </form>

        <div class="auth-footer">
          <p>Pas encore de compte ?</p>
          <a routerLink="/auth/register" class="btn btn-outline">
            Créer un compte
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: linear-gradient(135deg, var(--background-color) 0%, var(--primary-color) 100%);
    }

    .auth-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 480px;
      padding: 2rem;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .auth-header h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: var(--accent-color);
    }

    .auth-header p {
      color: #666;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 500;
      color: var(--accent-color);
    }

    .input-group {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-group i {
      position: absolute;
      left: 1rem;
      color: #666;
    }

    .input-group input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .input-group input:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.1);
      outline: none;
    }

    .input-group input.error {
      border-color: #ff4444;
    }

    .error-message {
      color: #ff4444;
      font-size: 0.875rem;
    }

    .toggle-password {
      position: absolute;
      right: 1rem;
      background: none;
      border: none;
      color: #666;
      cursor: pointer;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .remember-me {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .forgot-password {
      color: var(--primary-color);
      text-decoration: none;
      font-size: 0.875rem;
    }

    .forgot-password:hover {
      text-decoration: underline;
    }

    .btn-block {
      width: 100%;
      padding: 1rem;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .social-login {
      text-align: center;
      margin-top: 1.5rem;
    }

    .social-login p {
      color: #666;
      margin-bottom: 1rem;
      position: relative;
    }

    .social-login p::before,
    .social-login p::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 30%;
      height: 1px;
      background: #ddd;
    }

    .social-login p::before {
      left: 0;
    }

    .social-login p::after {
      right: 0;
    }

    .social-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .btn-social {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: white;
      color: #666;
      transition: all 0.3s ease;
    }

    .btn-google:hover {
      background: #dd4b39;
      color: white;
      border-color: #dd4b39;
    }

    .btn-facebook:hover {
      background: #3b5998;
      color: white;
      border-color: #3b5998;
    }

    .auth-footer {
      text-align: center;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #eee;
    }

    .auth-footer p {
      margin-bottom: 1rem;
      color: #666;
    }

    @media (max-width: 480px) {
      .auth-card {
        padding: 1.5rem;
      }

      .social-buttons {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      try {
        // Implémenter la logique de connexion ici
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulation
        console.log('Form submitted:', this.loginForm.value);
      } catch (error) {
        console.error('Login error:', error);
      } finally {
        this.isLoading = false;
      }
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }
}
