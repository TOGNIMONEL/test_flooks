import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favorites-tab',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="favorites-tab">
      <h1>Vos Favoris</h1>
      
      <div class="favorites-grid">
        <div *ngFor="let favorite of favorites" class="favorite-card">
          <div class="favorite-image">
            <img [src]="favorite.image" [alt]="favorite.name">
            <button class="btn-remove" (click)="removeFavorite(favorite)">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="favorite-info">
            <h3>{{ favorite.name }}</h3>
            <p class="artisan">{{ favorite.artisan }}</p>
            <div class="favorite-actions">
              <button class="btn btn-primary btn-sm" [routerLink]="['/product', favorite.id]">
                Voir
              </button>
              <button class="btn btn-outline btn-sm" (click)="addToCart(favorite)">
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div *ngIf="favorites.length === 0" class="empty-state">
        <i class="fas fa-heart-broken"></i>
        <h3>Aucun favori pour le moment</h3>
        <p>Explorez notre catalogue et ajoutez des créations à vos favoris</p>
        <button class="btn btn-primary" routerLink="/explore">Explorer les créations</button>
      </div>
    </div>
  `,
  styles: [`
    .favorites-tab {
      padding: 1rem;
    }
    
    h1 {
      margin-bottom: 2rem;
    }
    
    .favorites-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
    }
    
    .favorite-card {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: var(--shadow);
      transition: transform 0.3s ease;
    }
    
    .favorite-card:hover {
      transform: translateY(-5px);
    }
    
    .favorite-image {
      position: relative;
      height: 200px;
    }
    
    .favorite-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .btn-remove {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.8);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .btn-remove:hover {
      background: var(--error-color);
      color: white;
    }
    
    .favorite-info {
      padding: 1.5rem;
    }
    
    .favorite-info h3 {
      margin: 0 0 0.5rem;
    }
    
    .artisan {
      color: var(--text-light);
      margin-bottom: 1rem;
    }
    
    .favorite-actions {
      display: flex;
      gap: 0.5rem;
    }
    
    .empty-state {
      text-align: center;
      padding: 3rem;
      background: var(--background-alt);
      border-radius: 8px;
    }
    
    .empty-state i {
      font-size: 3rem;
      color: var(--text-light);
      margin-bottom: 1rem;
    }
    
    .empty-state h3 {
      margin: 0 0 0.5rem;
    }
    
    .empty-state p {
      margin-bottom: 1.5rem;
      color: var(--text-light);
    }
  `]
})
export class FavoritesTabComponent {
  @Input() favorites: any[] = [];
  
  removeFavorite(favorite: any): void {
    // Logique pour supprimer un favori
    console.log('Removing favorite:', favorite);
  }
  
  addToCart(favorite: any): void {
    // Logique pour ajouter au panier
    console.log('Adding to cart:', favorite);
  }
}
