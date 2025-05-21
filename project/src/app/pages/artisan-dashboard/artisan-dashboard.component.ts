import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-artisan-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="artisan-dashboard">
      <h1>Tableau de bord Artisan</h1>
      <div class="stats">
        <div class="stat-card">
          <h2>Commandes en cours</h2>
          <p>{{ ongoingOrders.length }}</p>
        </div>
        <div class="stat-card">
          <h2>Ventes totales</h2>
          <p>{{ totalSales | currency:'EUR':'symbol':'1.0-2':'fr' }}</p>
        </div>
        <div class="stat-card">
          <h2>Évaluations</h2>
          <p>{{ averageRating }}</p>
        </div>
      </div>

      <div class="orders-section">
        <h2>Mes Commandes</h2>
        <div class="orders-list">
          @for (order of ongoingOrders; track order.id) {
            <div class="order-card" (click)="viewOrderDetails(order.id)">
              <img [src]="order.productImage" [alt]="order.productName">
              <div class="order-info">
                <h3>{{ order.productName }}</h3>
                <p class="client">Client: {{ order.clientName }}</p>
                <p class="status">{{ order.status }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .artisan-dashboard {
      padding: 2rem;
      background: #f9f9f9;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .stats {
      display: flex;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      flex: 1;
    }

    .orders-section {
      margin-top: 2rem;
    }

    .orders-list {
      display: grid;
      gap: 1rem;
    }

    .order-card {
      display: flex;
      gap: 1rem;
      background: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      cursor: pointer;
    }

    .order-card img {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 8px;
    }

    .order-info {
      flex: 1;
    }

    .order-info h3 {
      margin: 0;
    }

    .client {
      color: #666;
      font-size: 0.9rem;
    }

    .status {
      font-weight: bold;
    }
  `]
})
export class ArtisanDashboardComponent implements OnInit {
  ongoingOrders = [
    {
      id: 1,
      productName: 'Vase Collection Été',
      clientName: 'John Doe',
      productImage: '/assets/order1.jpg',
      status: 'En cours'
    },
    // ... autres commandes
  ];

  totalSales = 5000; // Exemple de chiffre
  averageRating = 4.5; // Exemple de note

  ngOnInit() {
    // Initialisation des données
  }

  viewOrderDetails(orderId: number) {
    // Logique pour afficher les détails de la commande
  }
}
