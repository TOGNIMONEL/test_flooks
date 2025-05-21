import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="footer">
      <div class="container footer-content">
        <div class="footer-section">
          <h3>ArtisanatMarket</h3>
          <p>L'artisanat réinventé pour une nouvelle génération</p>
          <div class="social-links">
            <a href="#"><i class="fab fa-facebook"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
          </div>
        </div>

        <div class="footer-section">
          <h4>Navigation</h4>
          <ul>
            <li><a routerLink="/explore">Explorer</a></li>
            
            <li><a routerLink="/artisans">Artisans</a></li>
            <li><a routerLink="/categories">Catégories</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Informations</h4>
          <ul>
            <li><a routerLink="/about">À propos</a></li>
            <li><a routerLink="/contact">Contact</a></li>
            <li><a routerLink="/faq">FAQ</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Newsletter</h4>
          <p>Restez informé de nos nouveautés</p>
          <div class="newsletter-form">
            <input type="email" placeholder="Votre email">
            <button class="btn btn-primary">S'inscrire</button>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="container">
          <p>&copy; 2025 ArtisanatMarket. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--accent-color);
      color: white;
      padding: 4rem 0 0;
      margin-top: 4rem;
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .footer-section h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    .footer-section h4 {
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }

    .social-links {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }

    .social-links a {
      color: white;
      font-size: 1.5rem;
      transition: color 0.3s ease;
    }

    .social-links a:hover {
      color: var(--primary-color);
    }

    .footer-section ul {
      list-style: none;
      padding: 0;
    }

    .footer-section ul li {
      margin-bottom: 0.5rem;
    }

    .footer-section ul a {
      color: white;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .footer-section ul a:hover {
      color: var(--primary-color);
    }

    .newsletter-form {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .newsletter-form input {
      flex: 1;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
    }

    .footer-bottom {
      margin-top: 4rem;
      padding: 1rem 0;
      background: rgba(0,0,0,0.2);
      text-align: center;
    }
  `]
})
export class FooterComponent {}