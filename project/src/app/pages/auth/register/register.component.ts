import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Créer un compte</h1>
          <p>Rejoignez notre communauté d'artisans et de passionnés</p>
        </div>

        <div class="account-type-selector">
          <button 
            class="type-btn" 
            [class.active]="accountType === 'client'"
            (click)="setAccountType('client')">
            <i class="fas fa-user"></i>
            <span>Client</span>
          </button>
          <button 
            class="type-btn" 
            [class.active]="accountType === 'artisan'"
            (click)="setAccountType('artisan')">
            <i class="fas fa-tools"></i>
            <span>Artisan</span>
          </button>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-grid">
            <div class="form-group">
              <label for="firstName">Prénom</label>
              <div class="input-group">
                <i class="fas fa-user"></i>
                <input 
                  type="text" 
                  id="firstName" 
                  formControlName="firstName" 
                  placeholder="Votre prénom"
                  [class.error]="isFieldInvalid('firstName')">
              </div>
              @if (isFieldInvalid('firstName')) {
                <span class="error-message">Prénom requis</span>
              }
            </div>

            <div class="form-group">
              <label for="lastName">Nom</label>
              <div class="input-group">
                <i class="fas fa-user"></i>
                <input 
                  type="text" 
                  id="lastName" 
                  formControlName="lastName" 
                  placeholder="Votre nom"
                  [class.error]="isFieldInvalid('lastName')">
              </div>
              @if (isFieldInvalid('lastName')) {
                <span class="error-message">Nom requis</span>
              }
            </div>
          </div>

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
            <label for="profileImage">Photo de profil (optionnel)</label>
            <div class="input-group">
              <i class="fas fa-image"></i>
              <input 
                type="text" 
                id="profileImage" 
                formControlName="profileImage" 
                placeholder="URL de votre photo">
            </div>
            <div class="profile-image-preview" *ngIf="registerForm.get('profileImage')?.value">
              <img [src]="registerForm.get('profileImage')?.value" alt="Aperçu de la photo de profil">
            </div>
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
              <div class="password-requirements">
                <p>Le mot de passe doit contenir :</p>
                <ul>
                  <li [class.valid]="hasMinLength()">
                    <i class="fas" [class.fa-check]="hasMinLength()" [class.fa-times]="!hasMinLength()"></i>
                    Au moins 8 caractères
                  </li>
                  <li [class.valid]="hasUpperCase()">
                    <i class="fas" [class.fa-check]="hasUpperCase()" [class.fa-times]="!hasUpperCase()"></i>
                    Une majuscule
                  </li>
                  <li [class.valid]="hasNumber()">
                    <i class="fas" [class.fa-check]="hasNumber()" [class.fa-times]="!hasNumber()"></i>
                    Un chiffre
                  </li>
                </ul>
              </div>
            }
          </div>

          @if (accountType === 'artisan') {
            <div class="form-group">
              <label for="specialty">Spécialité</label>
              <div class="input-group">
                <i class="fas fa-hammer"></i>
                <select id="specialty" formControlName="specialty">
                  <option value="">Sélectionnez votre spécialité</option>
                  <option value="ceramique">Céramique</option>
                  <option value="bois">Ébénisterie</option>
                  <option value="bijoux">Bijouterie</option>
                  <option value="textile">Textile</option>
                  <option value="verre">Verrerie</option>
                </select>
              </div>
              @if (isFieldInvalid('specialty')) {
                <span class="error-message">Spécialité requise</span>
              }
            </div>

            <div class="form-group">
              <label for="experience">Années d'expérience</label>
              <div class="input-group">
                <i class="fas fa-calendar-alt"></i>
                <select id="experience" formControlName="experience">
                  <option value="">Sélectionnez votre expérience</option>
                  <option value="1-3">1-3 ans</option>
                  <option value="4-7">4-7 ans</option>
                  <option value="8-15">8-15 ans</option>
                  <option value="15+">Plus de 15 ans</option>
                </select>
              </div>
              @if (isFieldInvalid('experience')) {
                <span class="error-message">Expérience requise</span>
              }
            </div>

            <div class="form-group">
              <label for="description">Description de votre activité</label>
              <textarea 
                id="description" 
                formControlName="description" 
                placeholder="Décrivez votre activité et votre savoir-faire..."
                rows="4">
              </textarea>
              @if (isFieldInvalid('description')) {
                <span class="error-message">Description requise</span>
              }
            </div>

            <div class="form-group">
              <label for="certificates">Certifications (séparées par des virgules)</label>
              <div class="input-group">
                <i class="fas fa-certificate"></i>
                <input 
                  type="text" 
                  id="certificates" 
                  formControlName="certificates" 
                  placeholder="Ex: CAP Ébénisterie, Meilleur Ouvrier de France">
              </div>
            </div>
          }

          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="terms">
              <span>J'accepte les <a href="/terms" target="_blank">conditions d'utilisation</a> et la <a href="/privacy" target="_blank">politique de confidentialité</a></span>
            </label>
            @if (isFieldInvalid('terms')) {
              <span class="error-message">Vous devez accepter les conditions d'utilisation</span>
            }
          </div>

          <button 
            type="submit" 
            class="btn btn-primary btn-block"
            [disabled]="registerForm.invalid || isLoading">
            @if (isLoading) {
              <i class="fas fa-spinner fa-spin"></i>
              Création du compte...
            } @else {
              Créer mon compte
            }
          </button>
        </form>

        <div class="auth-footer">
          <p>Déjà inscrit ?</p>
          <a routerLink="/auth/login" class="btn btn-outline">
            Se connecter
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 80px);
      padding: 2rem;
      background: linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(255,255,255,1) 100%);
    }
    
    .auth-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 600px;
      padding: 2.5rem;
      position: relative;
      overflow: hidden;
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
      color: var(--text-light);
    }
    
    .auth-form {
      margin-bottom: 1.5rem;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    
    .input-group {
      position: relative;
      display: flex;
      align-items: center;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    
    .input-group:focus-within {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2);
    }
    
    .input-group i {
      padding: 0 1rem;
      color: #999;
      font-size: 1rem;
    }
    
    .input-group input,
    .input-group select {
      flex: 1;
      padding: 0.75rem;
      border: none;
      outline: none;
      font-size: 1rem;
      font-family: inherit;
      background: transparent;
    }
    
    .input-group input.error,
    .input-group select.error {
      background-color: rgba(255, 65, 54, 0.05);
    }
    
    .toggle-password {
      background: none;
      border: none;
      padding: 0 1rem;
      cursor: pointer;
      color: #999;
    }
    
    .toggle-password:hover {
      color: var(--primary-color);
    }
    
    .error-message {
      color: var(--error-color);
      font-size: 0.875rem;
      margin-top: 0.25rem;
      display: block;
    }
    
    .btn-block {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
    }
    
    .btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .auth-footer {
      text-align: center;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-color);
    }
    
    .auth-footer p {
      margin-bottom: 0.5rem;
      color: var(--text-light);
    }
    
    .account-type-selector {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .type-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1.5rem;
      border: 2px solid #ddd;
      border-radius: 12px;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .type-btn i {
      font-size: 1.5rem;
      color: #666;
    }

    .type-btn.active {
      border-color: var(--primary-color);
      background: rgba(var(--primary-color-rgb), 0.1);
    }

    .type-btn.active i {
      color: var(--primary-color);
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      resize: vertical;
      min-height: 100px;
    }

    .password-requirements {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      margin-top: 0.5rem;
    }

    .password-requirements p {
      margin: 0 0 0.5rem;
      font-size: 0.875rem;
      color: #666;
    }

    .password-requirements ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .password-requirements li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 0.25rem;
    }

    .password-requirements li.valid {
      color: #28a745;
    }

    .password-requirements li i {
      width: 16px;
    }

    .password-requirements li i.fa-check {
      color: #28a745;
    }

    .password-requirements li i.fa-times {
      color: #dc3545;
    }

    .checkbox-label {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      cursor: pointer;
    }

    .checkbox-label input {
      margin-top: 0.25rem;
    }

    .checkbox-label a {
      color: var(--primary-color);
      text-decoration: none;
    }

    .checkbox-label a:hover {
      text-decoration: underline;
    }

    .profile-image-preview {
      margin-top: 1rem;
      text-align: center;
    }

    .profile-image-preview img {
      max-width: 150px;
      max-height: 150px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid var(--primary-color);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    @media (max-width: 480px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
      
      .auth-card {
        padding: 1.5rem;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm!: FormGroup;
  showPassword = false;
  isLoading = false;
  accountType: 'client' | 'artisan' = 'client';

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  private initForm() {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9]).*$/)
      ]],
      profileImage: [''],
      terms: [false, [Validators.requiredTrue]]
    });
  }

  setAccountType(type: 'client' | 'artisan') {
    this.accountType = type;
    if (type === 'artisan') {
      this.registerForm.addControl('specialty', this.fb.control('', Validators.required));
      this.registerForm.addControl('experience', this.fb.control('', Validators.required));
      this.registerForm.addControl('description', this.fb.control('', Validators.required));
      this.registerForm.addControl('certificates', this.fb.control(''));
    } else {
      this.registerForm.removeControl('specialty');
      this.registerForm.removeControl('experience');
      this.registerForm.removeControl('description');
      this.registerForm.removeControl('certificates');
    }
  }

  get password() {
    return this.registerForm.get('password')!;
  }

  hasMinLength(): boolean {
    const value = this.password.value;
    return value ? value.length >= 8 : false;
  }

  hasUpperCase(): boolean {
    const value = this.password.value;
    return value ? /[A-Z]/.test(value) : false;
  }

  hasNumber(): boolean {
    const value = this.password.value;
    return value ? /[0-9]/.test(value) : false;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      try {
        // Implémenter la logique d'inscription ici
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulation
        console.log('Form submitted:', this.registerForm.value);
      } catch (error) {
        console.error('Registration error:', error);
      } finally {
        this.isLoading = false;
      }
    } else {
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }
}
