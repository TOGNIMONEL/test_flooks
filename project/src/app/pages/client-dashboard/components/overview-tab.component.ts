import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-overview-tab',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="overview-tab">
      <div class="welcome-banner">
        <h1>Bienvenue, {{ user.name }}</h1>
        <p>Découvrez les dernières créations de nos artisans</p>
      </div>
      
      <div class="stats-cards">
        <div class="stat-card">
          <i class="fas fa-box"></i>
          <div class="stat-info">
            <span class="stat-value">{{ stats.orders }}</span>
            <span class="stat-label">Commandes</span>
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-heart"></i>
          <div class="stat-info">
            <span class="stat-value">{{ stats.favorites }}</span>
            <span class="stat-label">Favoris</span>
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-envelope"></i>
          <div class="stat-info">
            <span class="stat-value">{{ stats.messages }}</span>
            <span class="stat-label">Messages</span>
          </div>
        </div>
      </div>
      
      <div class="recent-orders">
        <div class="section-header">
          <h2>Commandes récentes</h2>
          <a routerLink="/client-dashboard" (click)="setActiveTab('orders')">Voir tout</a>
        </div>
        
        <div class="orders-list">
          <div *ngFor="let order of recentOrders" class="order-card">
            <img [src]="order.image" [alt]="order.name">
            <div class="order-info">
              <h3>{{ order.name }}</h3>
              <p>Artisan: {{ order.artisan }}</p>
              <div class="progress-container">
                <div class="progress-bar" [style.width.%]="order.progress"></div>
              </div>
              <span class="status">{{ order.status }}</span>
            </div>
          </div>
          
          <div *ngIf="recentOrders.length === 0" class="empty-state">
            <p>Aucune commande récente</p>
            <button class="btn btn-primary" routerLink="/explore">Explorer</button>
          </div>
        </div>
      </div>
      
      <div class="favorites-preview">
        <div class="section-header">
          <h2>Vos favoris</h2>
          <a routerLink="/client-dashboard" (click)="setActiveTab('favorites')">Voir tout</a>
        </div>
        
        <div class="favorites-grid">
          <div *ngFor="let favorite of recentFavorites" class="favorite-card">
            <img [src]="favorite.image" [alt]="favorite.name">
            <div class="favorite-info">
              <h3>{{ favorite.name }}</h3>
              <p>{{ favorite.artisan }}</p>
            </div>
          </div>
          
          <div *ngIf="recentFavorites.length === 0" class="empty-state">
            <p>Aucun favori pour le moment</p>
            <button class="btn btn-primary" routerLink="/explore">Explorer</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .overview-tab {
      padding: 1rem;
    }
    
    .welcome-banner {
      background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
      color: white;
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }
    
    .welcome-banner h1 {
      margin: 0 0 0.5rem;
    }
    
    .welcome-banner p {
      margin: 0;
      opacity: 0.9;
    }
    
    .stats-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
    }
    
    .stat-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      box-shadow: var(--shadow);
    }
    
    .stat-card i {
      font-size: 2rem;
      color: var(--primary-color);
      margin-right: 1rem;
    }
    
    .stat-info {
      display: flex;
      flex-direction: column;
    }
    
    .stat-value {
      font-size: 1.5rem;
      font-weight: bold;
    }
    
    .stat-label {
      color: var(--text-light);
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .section-header h2 {
      margin: 0;
    }
    
    .orders-list {
      display: grid;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    
    .order-card {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      box-shadow: var(--shadow);
    }
    
    .order-card img {
      width: 100px;
      height: 100px;
      object-fit: cover;
    }
    
    .order-info {
      padding: 1rem;
      flex: 1;
    }
    
    .order-info h3 {
      margin: 0 0 0.5rem;
    }
    
    .order-info p {
      margin: 0 0 0.5rem;
      color: var(--text-light);
    }
    
    .progress-container {
      height: 6px;
      background: #eee;
      border-radius: 3px;
      margin-bottom: 0.5rem;
    }
    
    .progress-bar {
      height: 100%;
      background: var(--primary-color);
      border-radius: 3px;
    }
    
    .status {
      font-size: 0.9rem;
      color: var(--text-light);
    }
    
    .favorites-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }
    
    .favorite-card {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: var(--shadow);
    }
    
    .favorite-card img {
      width: 100%;
      height: 150px;
      object-fit: cover;
    }
    
    .favorite-info {
      padding: 1rem;
    }
    
    .favorite-info h3 {
      margin: 0 0 0.5rem;
      font-size: 1rem;
    }
    
    .favorite-info p {
      margin: 0;
      color: var(--text-light);
      font-size: 0.9rem;
    }
    
    .empty-state {
      text-align: center;
      padding: 2rem;
      background: var(--background-alt);
      border-radius: 8px;
    }
    
    @media (max-width: 768px) {
      .stats-cards {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class OverviewTabComponent {
  @Input() user: any;
  @Input() stats: any;
  @Input() recentOrders: any[] = [];
  @Input() recentFavorites: any[] = [];
  @Input() setActiveTab: (tab: string) => void = () => {};
}
