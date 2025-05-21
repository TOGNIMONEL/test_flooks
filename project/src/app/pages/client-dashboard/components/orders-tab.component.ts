import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders-tab',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="orders-tab">
      <h1>Mes Commandes</h1>
      
      <div class="orders-filters">
        <button 
          class="filter-btn" 
          [class.active]="activeFilter === 'all'"
          (click)="setFilter('all')">
          Toutes
        </button>
        <button 
          class="filter-btn" 
          [class.active]="activeFilter === 'in-progress'"
          (click)="setFilter('in-progress')">
          En cours
        </button>
        <button 
          class="filter-btn" 
          [class.active]="activeFilter === 'completed'"
          (click)="setFilter('completed')">
          Terminées
        </button>
      </div>
      
      <div class="orders-list">
        <div *ngFor="let order of filteredOrders" class="order-card">
          <div class="order-image">
            <img [src]="order.image" [alt]="order.name">
          </div>
          <div class="order-details">
            <div class="order-header">
              <h3>{{ order.name }}</h3>
              <span class="order-id">Commande #{{ order.id }}</span>
            </div>
            <p class="artisan">Artisan: {{ order.artisan }}</p>
            <div class="progress-container">
              <div class="progress-bar" [style.width.%]="order.progress"></div>
            </div>
            <div class="order-footer">
              <span class="status">{{ order.status }}</span>
              <button class="btn btn-primary btn-sm" [routerLink]="['/order-tracking', order.id]">
                Suivre
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div *ngIf="filteredOrders.length === 0" class="empty-state">
        <i class="fas fa-box-open"></i>
        <h3>Aucune commande pour le moment</h3>
        <p>Explorez notre catalogue et passez votre première commande</p>
        <button class="btn btn-primary" routerLink="/explore">Explorer les créations</button>
      </div>
    </div>
  `,
  styles: [`
    .orders-tab {
      padding: 1rem;
    }
    
    h1 {
      margin-bottom: 2rem;
    }
    
    .orders-filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    
    .filter-btn {
      padding: 0.5rem 1rem;
      border: none;
      background: var(--background-alt);
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .filter-btn.active {
      background: var(--primary-color);
      color: var(--accent-color);
    }
    
    .orders-list {
      display: grid;
      gap: 1.5rem;
    }
    
    .order-card {
      display: flex;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: var(--shadow);
    }
    
    .order-image {
      width: 120px;
      flex-shrink: 0;
    }
    
    .order-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .order-details {
      flex: 1;
      padding: 1.5rem;
    }
    
    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.5rem;
    }
    
    .order-header h3 {
      margin: 0;
    }
    
    .order-id {
      font-size: 0.9rem;
      color: var(--text-light);
    }
    
    .artisan {
      color: var(--text-light);
      margin-bottom: 1rem;
    }
    
    .progress-container {
      height: 6px;
      background: #eee;
      border-radius: 3px;
      margin-bottom: 1rem;
    }
    
    .progress-bar {
      height: 100%;
      background: var(--primary-color);
      border-radius: 3px;
    }
    
    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .status {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.9rem;
      background: var(--background-alt);
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
    
    @media (max-width: 768px) {
      .order-card {
        flex-direction: column;
      }
      
      .order-image {
        width: 100%;
        height: 150px;
      }
    }
  `]
})
export class OrdersTabComponent {
  @Input() orders: any[] = [];
  activeFilter = 'all';
  
  get filteredOrders(): any[] {
    if (this.activeFilter === 'all') {
      return this.orders;
    } else if (this.activeFilter === 'in-progress') {
      return this.orders.filter(order => order.progress < 100);
    } else {
      return this.orders.filter(order => order.progress === 100);
    }
  }
  
  setFilter(filter: string): void {
    this.activeFilter = filter;
  }
}
