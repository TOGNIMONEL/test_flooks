import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

// Import des sous-composants
import { OverviewTabComponent } from './components/overview-tab.component';
import { FavoritesTabComponent } from './components/favorites-tab.component';
import { OrdersTabComponent } from './components/orders-tab.component';
import { MessagesTabComponent } from './components/messages-tab.component';
import { CollaborationTabComponent } from './components/collaboration-tab.component';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    RouterOutlet, 
    FormsModule, 
    DragDropModule,
    OverviewTabComponent,
    FavoritesTabComponent,
    OrdersTabComponent,
    MessagesTabComponent,
    CollaborationTabComponent
  ],
  template: `
    <div class="dashboard-container">
      <div class="sidebar">
        <div class="user-profile">
          <img [src]="user.avatar" [alt]="user.name" class="avatar">
          <h3>{{ user.name }}</h3>
          <p>{{ user.email }}</p>
        </div>
        
        <nav class="dashboard-nav">
          <button 
            class="nav-item" 
            [class.active]="activeTab === 'overview'"
            (click)="setActiveTab('overview')">
            <i class="fas fa-home"></i>
            <span>Aperçu</span>
          </button>
          <button 
            class="nav-item" 
            [class.active]="activeTab === 'orders'"
            (click)="setActiveTab('orders')">
            <i class="fas fa-box"></i>
            <span>Commandes</span>
          </button>
          <button 
            class="nav-item" 
            [class.active]="activeTab === 'favorites'"
            (click)="setActiveTab('favorites')">
            <i class="fas fa-heart"></i>
            <span>Favoris</span>
          </button>
          <button 
            class="nav-item" 
            [class.active]="activeTab === 'messages'"
            (click)="setActiveTab('messages')">
            <i class="fas fa-envelope"></i>
            <span>Messages</span>
            <span *ngIf="unreadMessages > 0" class="badge">{{ unreadMessages }}</span>
          </button>
          <button 
            class="nav-item" 
            [class.active]="activeTab === 'collaboration'"
            (click)="setActiveTab('collaboration')">
            <i class="fas fa-users"></i>
            <span>Collaboration</span>
          </button>
          <button 
            class="nav-item" 
            [class.active]="activeTab === 'settings'"
            (click)="setActiveTab('settings')">
            <i class="fas fa-cog"></i>
            <span>Paramètres</span>
          </button>
        </nav>
        
        <div class="sidebar-footer">
          <button class="btn btn-outline" routerLink="/logout">
            <i class="fas fa-sign-out-alt"></i>
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
      
      <div class="dashboard-content">
        @if (activeTab === 'overview') {
          <app-overview-tab
            [user]="user"
            [stats]="stats"
            [recentOrders]="recentOrders"
            [recentFavorites]="recentFavorites"
            [setActiveTab]="setActiveTabMethod">
          </app-overview-tab>
        }
        
        @if (activeTab === 'favorites') {
          <app-favorites-tab
            [favorites]="favorites">
          </app-favorites-tab>
        }
        
        @if (activeTab === 'orders') {
          <app-orders-tab
            [orders]="orders">
          </app-orders-tab>
        }
        
        @if (activeTab === 'messages') {
          <app-messages-tab
            [conversations]="conversations">
          </app-messages-tab>
        }
        
        @if (activeTab === 'collaboration') {
          <app-collaboration-tab
            [user]="user"
            [ideas]="ideas"
            [workshops]="workshops">
          </app-collaboration-tab>
        }
        
        @if (activeTab === 'settings') {
          <div class="settings-tab">
            <h1>Paramètres du compte</h1>
            
            <div class="settings-grid">
              <div class="settings-card">
                <h2>Informations personnelles</h2>
                <div class="form-group">
                  <label>Nom complet</label>
                  <input type="text" [(ngModel)]="user.name">
                </div>
                <div class="form-group">
                  <label>Email</label>
                  <input type="email" [(ngModel)]="user.email">
                </div>
                <div class="form-group">
                  <label>Téléphone</label>
                  <input type="tel" [(ngModel)]="user.phone">
                </div>
                <button class="btn btn-primary">Enregistrer</button>
              </div>
              
              <div class="settings-card">
                <h2>Sécurité</h2>
                <div class="form-group">
                  <label>Mot de passe actuel</label>
                  <input type="password">
                </div>
                <div class="form-group">
                  <label>Nouveau mot de passe</label>
                  <input type="password">
                </div>
                <div class="form-group">
                  <label>Confirmer le mot de passe</label>
                  <input type="password">
                </div>
                <button class="btn btn-primary">Changer le mot de passe</button>
              </div>
              
              <div class="settings-card">
                <h2>Préférences</h2>
                <div class="form-group">
                  <label>Langue</label>
                  <select>
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Notifications</label>
                  <div class="checkbox-group">
                    <div class="checkbox">
                      <input type="checkbox" id="email-notif" checked>
                      <label for="email-notif">Notifications par email</label>
                    </div>
                    <div class="checkbox">
                      <input type="checkbox" id="sms-notif">
                      <label for="sms-notif">Notifications par SMS</label>
                    </div>
                  </div>
                </div>
                <button class="btn btn-primary">Enregistrer</button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: grid;
      grid-template-columns: 250px 1fr;
      min-height: calc(100vh - 60px);
    }
    
    .sidebar {
      background: white;
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    
    .user-profile {
      padding: 2rem 1.5rem;
      text-align: center;
      border-bottom: 1px solid var(--border-color);
    }
    
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: 1rem;
    }
    
    .user-profile h3 {
      margin: 0 0 0.25rem;
    }
    
    .user-profile p {
      margin: 0;
      color: var(--text-light);
      font-size: 0.9rem;
    }
    
    .dashboard-nav {
      flex: 1;
      padding: 1.5rem 0;
    }
    
    .nav-item {
      display: flex;
      align-items: center;
      padding: 0.75rem 1.5rem;
      width: 100%;
      border: none;
      background: none;
      text-align: left;
      cursor: pointer;
      position: relative;
      transition: all 0.3s ease;
    }
    
    .nav-item:hover {
      background: var(--background-alt);
    }
    
    .nav-item.active {
      background: var(--background-alt);
      color: var(--primary-color);
      font-weight: bold;
    }
    
    .nav-item.active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 4px;
      background: var(--primary-color);
    }
    
    .nav-item i {
      margin-right: 1rem;
      width: 20px;
      text-align: center;
    }
    
    .badge {
      background: var(--primary-color);
      color: white;
      font-size: 0.7rem;
      padding: 0.1rem 0.5rem;
      border-radius: 10px;
      margin-left: auto;
    }
    
    .sidebar-footer {
      padding: 1.5rem;
      border-top: 1px solid var(--border-color);
    }
    
    .sidebar-footer .btn {
      width: 100%;
    }
    
    .dashboard-content {
      background: var(--background-alt);
      min-height: 100%;
    }
    
    .settings-tab {
      padding: 1rem;
    }
    
    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    
    .settings-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: var(--shadow);
    }
    
    .settings-card h2 {
      margin: 0 0 1.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--border-color);
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }
    
    .form-group input,
    .form-group select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
    }
    
    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .checkbox {
      display: flex;
      align-items: center;
    }
    
    .checkbox input {
      margin-right: 0.5rem;
      width: auto;
    }
    
    @media (max-width: 768px) {
      .dashboard-container {
        grid-template-columns: 1fr;
      }
      
      .sidebar {
        display: none;
      }
    }
  `]
})
export class ClientDashboardComponent implements OnInit {
  activeTab = 'overview';
  
  user = {
    avatar: '/assets/avatar.jpg',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+33 6 12 34 56 78'
  };
  
  stats = {
    orders: 5,
    favorites: 12,
    messages: 3
  };
  
  favorites = [
    {
      id: 1,
      name: 'Vase Collection Été',
      artisan: 'Marie Dubois',
      image: '/assets/favorite1.jpg'
    },
    {
      id: 2,
      name: 'Sculpture Bois Flotté',
      artisan: 'Pierre Martin',
      image: '/assets/favorite2.jpg'
    },
    {
      id: 3,
      name: 'Bijou Ambre et Argent',
      artisan: 'Sophie Leclerc',
      image: '/assets/favorite3.jpg'
    }
  ];
  
  recentFavorites: any[] = [];
  
  orders = [
    {
      id: 1,
      name: 'Vase personnalisé',
      artisan: 'Marie Dubois',
      image: '/assets/order1.jpg',
      progress: 75,
      status: 'En cours de fabrication'
    },
    {
      id: 2,
      name: 'Lampe en bois',
      artisan: 'Pierre Martin',
      image: '/assets/order2.jpg',
      progress: 100,
      status: 'Livré'
    },
    {
      id: 3,
      name: 'Collier sur mesure',
      artisan: 'Sophie Leclerc',
      image: '/assets/order3.jpg',
      progress: 30,
      status: 'En attente de matériaux'
    }
  ];
  
  recentOrders: any[] = [];
  
  conversations = [
    {
      id: 1,
      name: 'Marie Dubois',
      avatar: '/assets/artisan1.jpg',
      lastMessage: 'Bonjour, votre commande est en cours de fabrication.',
      time: '10:30',
      unread: 2,
      status: 'En ligne',
      messages: [
        {
          text: 'Bonjour, j\'ai une question sur ma commande',
          sender: 'me',
          time: '10:15'
        },
        {
          text: 'Bonjour, je vous écoute',
          sender: 'Marie Dubois',
          time: '10:20'
        },
        {
          text: 'Quand sera-t-elle prête ?',
          sender: 'me',
          time: '10:25'
        },
        {
          text: 'Votre commande est en cours de fabrication. Elle devrait être prête d\'ici 3 jours.',
          sender: 'Marie Dubois',
          time: '10:30'
        }
      ]
    },
    {
      id: 2,
      name: 'Pierre Martin',
      avatar: '/assets/artisan2.jpg',
      lastMessage: 'Merci pour votre commande !',
      time: 'Hier',
      unread: 0,
      status: 'Hors ligne',
      messages: [
        {
          text: 'Bonjour, je viens de passer commande',
          sender: 'me',
          time: 'Hier, 15:30'
        },
        {
          text: 'Merci pour votre commande ! Je vais commencer à y travailler dès demain.',
          sender: 'Pierre Martin',
          time: 'Hier, 16:45'
        }
      ]
    },
    {
      id: 3,
      name: 'Sophie Leclerc',
      avatar: '/assets/artisan3.jpg',
      lastMessage: 'Les matériaux sont arrivés, je commence la fabrication.',
      time: 'Lun',
      unread: 1,
      status: 'En ligne',
      messages: [
        {
          text: 'Bonjour Sophie, avez-vous reçu les matériaux ?',
          sender: 'me',
          time: 'Lun, 09:15'
        },
        {
          text: 'Pas encore, je vous tiens au courant',
          sender: 'Sophie Leclerc',
          time: 'Lun, 10:30'
        },
        {
          text: 'Les matériaux sont arrivés, je commence la fabrication.',
          sender: 'Sophie Leclerc',
          time: 'Lun, 14:20'
        }
      ]
    }
  ];
  
  ideas = [
    {
      id: 1,
      title: 'Collection de bijoux inspirés de la nature',
      description: 'J\'aimerais voir une collection de bijoux inspirés par les formes organiques de la nature, comme les feuilles, les fleurs, etc.',
      userName: 'Emma Laurent',
      userAvatar: '/assets/user1.jpg',
      votes: 15,
      voted: false,
      comments: [
        {
          id: 1,
          text: 'Super idée ! J\'adore les bijoux nature.',
          userName: 'Thomas Petit',
          userAvatar: '/assets/user2.jpg',
          date: new Date('2025-03-28')
        },
        {
          id: 2,
          text: 'On pourrait même utiliser des matériaux écologiques.',
          userName: 'Julie Martin',
          userAvatar: '/assets/user3.jpg',
          date: new Date('2025-03-29')
        }
      ],
      showComments: false,
      newComment: ''
    },
    {
      id: 2,
      title: 'Atelier de personnalisation de céramique',
      description: 'Ce serait génial d\'avoir un atelier où les clients peuvent personnaliser leurs propres pièces de céramique avec l\'aide d\'un artisan.',
      userName: 'Lucas Dubois',
      userAvatar: '/assets/user4.jpg',
      votes: 8,
      voted: false,
      comments: [
        {
          id: 1,
          text: 'J\'adorerais participer à ce genre d\'atelier !',
          userName: 'Emma Laurent',
          userAvatar: '/assets/user1.jpg',
          date: new Date('2025-03-30')
        }
      ],
      showComments: false,
      newComment: ''
    }
  ];
  
  workshops = [
    {
      id: 1,
      title: 'Initiation à la poterie',
      description: 'Apprenez les bases de la poterie avec notre artisan expert.',
      date: new Date('2025-04-15'),
      image: '/assets/workshop1.jpg',
      participants: 8
    },
    {
      id: 2,
      title: 'Création de bijoux en macramé',
      description: 'Découvrez l\'art du macramé et créez vos propres bijoux.',
      date: new Date('2025-04-22'),
      image: '/assets/workshop2.jpg',
      participants: 5
    }
  ];
  
  get unreadMessages(): number {
    return this.conversations.reduce((total, conv) => total + (conv.unread || 0), 0);
  }
  
  setActiveTabMethod = (tab: string) => {
    this.activeTab = tab;
  };
  
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  
  ngOnInit(): void {
    // Initialiser les données récentes
    this.recentOrders = this.orders.slice(0, 2);
    this.recentFavorites = this.favorites.slice(0, 3);
  }
}