import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OptimizedImageComponent } from '../optimized-image/optimized-image.component';

@Component({
  selector: 'app-artisan-card',
  standalone: true,
  imports: [CommonModule, RouterLink, OptimizedImageComponent],
  template: `
    <div 
      class="artisan-card" 
      [routerLink]="['/artisan', artisan.id]"
      (mouseenter)="onMouseEnter()"
      (mouseleave)="onMouseLeave()">
      <div class="card-image">
        <app-optimized-image 
          [src]="artisan.image" 
          [alt]="artisan.name"
          position="above-fold"
          [usePicture]="true"
        ></app-optimized-image>
        @if (artisan.certified) {
          <div class="badge">
            <i class="fas fa-certificate"></i>
          </div>
        }
      </div>
      <div class="card-content">
        <h3>{{ artisan.name }}</h3>
        <p class="specialty">{{ artisan.specialty }}</p>
        <div class="rating">
          <span class="stars">
            @for (star of getStars(artisan.rating); track star) {
              <i class="fas fa-star"></i>
            }
            @if (hasHalfStar(artisan.rating)) {
              <i class="fas fa-star-half-alt"></i>
            }
          </span>
          <span class="rating-value">{{ artisan.rating }}</span>
        </div>
      </div>
      <div class="card-overlay">
        <button class="btn btn-primary">Voir le profil</button>
      </div>
    </div>
  `,
  styles: [`
    .artisan-card {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      cursor: pointer;
      background: white;
      height: 100%;
    }

    .artisan-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 30px rgba(0,0,0,0.2);
    }

    .card-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .artisan-card:hover .card-image img {
      transform: scale(1.1);
    }

    .badge {
      position: absolute;
      top: 10px;
      right: 10px;
      background: var(--primary-color);
      color: var(--accent-color);
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      animation: pulse 2s infinite;
    }

    .card-content {
      padding: 1.5rem;
    }

    .card-content h3 {
      margin: 0 0 0.5rem;
      font-size: 1.2rem;
    }

    .specialty {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .stars {
      color: var(--primary-color);
    }

    .rating-value {
      font-weight: bold;
    }

    .card-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .artisan-card:hover .card-overlay {
      opacity: 1;
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
  `]
})
export class ArtisanCardComponent {
  @Input() artisan: any;
  
  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }
  
  hasHalfStar(rating: number): boolean {
    return rating % 1 >= 0.5;
  }
  
  onMouseEnter() {
    // Animation supplémentaire si nécessaire
  }
  
  onMouseLeave() {
    // Animation supplémentaire si nécessaire
  }
}
