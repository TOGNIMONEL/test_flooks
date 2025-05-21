import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FavoritesService } from '../../services/favorites.service';
import { CartService } from '../../services/cart.service';
import { MessagingService, Conversation } from '../../services/messaging.service';

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  template: `
    <div class="client-profile">
      <div class="profile-header">
        <div class="container">
          <div class="profile-info">
            <img [src]="client.avatar" [alt]="client.name" class="avatar">
            <div class="info">
              <h1>{{ client.name }}</h1>
              <p class="member-since">Membre depuis {{ client.memberSince | date:'MMMM yyyy' }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="container content">
        <div class="profile-tabs">
          <button 
            class="tab-btn" 
            [class.active]="activeTab === 'profile'" 
            (click)="setActiveTab('profile')">
            <i class="fas fa-user"></i> Profil
          </button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab === 'orders'" 
            (click)="setActiveTab('orders')">
            <i class="fas fa-shopping-bag"></i> Commandes
          </button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab === 'favorites'" 
            (click)="setActiveTab('favorites')">
            <i class="fas fa-heart"></i> Favoris
          </button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab === 'messages'" 
            (click)="setActiveTab('messages')">
            <i class="fas fa-envelope"></i> Messages
          </button>
        </div>

        <div class="tab-content">
          <!-- Onglet Profil -->
          @if (activeTab === 'profile') {
            <div class="profile-section">
              <h2>Informations personnelles</h2>
              <div class="personal-info">
                <div class="info-group">
                  <label>Nom complet</label>
                  <p>{{ client.name }}</p>
                </div>
                <div class="info-group">
                  <label>Email</label>
                  <p>{{ client.email }}</p>
                </div>
                <div class="info-group">
                  <label>Téléphone</label>
                  <p>{{ client.phone }}</p>
                </div>
                <div class="info-group">
                  <label>Adresse</label>
                  <p>{{ client.address }}</p>
                </div>
              </div>
              
              <button class="btn btn-primary">
                <i class="fas fa-edit"></i> Modifier mes informations
              </button>
            </div>
          }

          <!-- Onglet Commandes -->
          @if (activeTab === 'orders') {
            <div class="orders-section">
              <h2>Mes commandes</h2>
              
              @if (orders.length === 0) {
                <div class="empty-state">
                  <i class="fas fa-shopping-bag fa-3x"></i>
                  <p>Vous n'avez pas encore de commande.</p>
                  <button class="btn btn-primary" routerLink="/shop">
                    Découvrir nos artisans
                  </button>
                </div>
              } @else {
                <div class="orders-list">
                  @for (order of orders; track order.id) {
                    <div class="order-card">
                      <div class="order-header">
                        <div class="order-info">
                          <h3>Commande #{{ order.id }}</h3>
                          <span class="order-date">{{ order.date | date:'dd/MM/yyyy' }}</span>
                        </div>
                        <div class="order-status" [class]="order.status.toLowerCase()">
                          {{ order.status }}
                        </div>
                      </div>
                      
                      <div class="order-items">
                        @for (item of order.items; track item.id) {
                          <div class="order-item">
                            <img [src]="item.image" [alt]="item.name" class="item-image">
                            <div class="item-details">
                              <h4>{{ item.name }}</h4>
                              <p class="item-artisan">Par {{ item.artisan }}</p>
                              <div class="item-price-qty">
                                <span class="item-price">{{ item.price | currency:'EUR' }}</span>
                                <span class="item-qty">x{{ item.quantity }}</span>
                              </div>
                            </div>
                          </div>
                        }
                      </div>
                      
                      <div class="order-footer">
                        <div class="order-total">
                          <span>Total</span>
                          <span class="total-price">{{ order.total | currency:'EUR' }}</span>
                        </div>
                        <div class="order-actions">
                          <button class="btn btn-outline">
                            <i class="fas fa-receipt"></i> Voir la facture
                          </button>
                          @if (order.status === 'Livré') {
                            <button class="btn btn-primary">
                              <i class="fas fa-star"></i> Évaluer
                            </button>
                          }
                        </div>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          }

          <!-- Onglet Favoris -->
          @if (activeTab === 'favorites') {
            <div class="favorites-section">
              <h2>Mes favoris</h2>
              
              @if (favoriteItems.length === 0) {
                <div class="empty-state">
                  <i class="fas fa-heart fa-3x"></i>
                  <p>Vous n'avez pas encore ajouté d'articles à vos favoris.</p>
                  <button class="btn btn-primary" routerLink="/shop">
                    Découvrir nos artisans
                  </button>
                </div>
              } @else {
                <div class="favorites-grid">
                  @for (item of favoriteItems; track item.id) {
                    <div class="favorite-card">
                      <div class="favorite-image">
                        <img [src]="item.image" [alt]="item.title">
                        <div class="favorite-actions">
                          <button class="action-btn" [routerLink]="['/product', item.id]">
                            <i class="fas fa-eye"></i>
                          </button>
                          <button class="action-btn" (click)="removeFromFavorites(item.id)">
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      <div class="favorite-info">
                        <h3>{{ item.title }}</h3>
                        <p class="favorite-artisan">Par {{ item.artisan }}</p>
                        <div class="favorite-price">{{ item.price | currency:'EUR' }}</div>
                        <button class="btn btn-primary btn-sm" (click)="addToCart(item)">
                          <i class="fas fa-shopping-cart"></i> Ajouter au panier
                        </button>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          }

          <!-- Onglet Messages -->
          @if (activeTab === 'messages') {
            <div class="messages-section">
              <h2>Mes messages</h2>
              
              <div class="messages-container">
                <div class="conversations-list">
                  @if (conversations.length === 0) {
                    <div class="empty-state small">
                      <i class="fas fa-envelope fa-2x"></i>
                      <p>Aucune conversation</p>
                    </div>
                  } @else {
                    @for (conversation of conversations; track conversation.id) {
                      <div class="conversation-item" 
                           [class.active]="selectedConversation?.id === conversation.id"
                           (click)="selectConversation(conversation)">
                        <div class="conversation-avatar">
                          @if (conversation.participants.length > 0) {
                            <img [src]="getOtherParticipant(conversation).avatar" 
                                 [alt]="getOtherParticipant(conversation).name">
                          }
                        </div>
                        <div class="conversation-info">
                          <h4>{{ getOtherParticipant(conversation).name }}</h4>
                          @if (conversation.lastMessage) {
                            <p class="last-message" [class.unread]="!conversation.lastMessage.read">
                              {{ conversation.lastMessage.text | slice:0:30 }}
                              {{ conversation.lastMessage.text.length > 30 ? '...' : '' }}
                            </p>
                            <span class="message-time">{{ conversation.lastMessage.timestamp | date:'shortTime' }}</span>
                          }
                        </div>
                      </div>
                    }
                  }
                </div>
                
                <div class="conversation-view">
                  @if (!selectedConversation) {
                    <div class="empty-state">
                      <i class="fas fa-comments fa-3x"></i>
                      <p>Sélectionnez une conversation pour afficher les messages</p>
                    </div>
                  } @else {
                    <div class="conversation-header">
                      <div class="conversation-participant">
                        <img [src]="getOtherParticipant(selectedConversation).avatar" 
                             [alt]="getOtherParticipant(selectedConversation).name">
                        <h3>{{ getOtherParticipant(selectedConversation).name }}</h3>
                      </div>
                    </div>
                    
                    <div class="messages-list">
                      @for (message of getConversationMessages(selectedConversation.id); track message.id) {
                        <div class="message-bubble" [class.outgoing]="message.senderId === client.id">
                          <div class="message-content">
                            <p>{{ message.text }}</p>
                            <span class="message-time">{{ message.timestamp | date:'shortTime' }}</span>
                          </div>
                        </div>
                      }
                    </div>
                    
                    <div class="message-input">
                      <input 
                        type="text" 
                        [(ngModel)]="newMessage" 
                        placeholder="Écrivez votre message..."
                        (keyup.enter)="sendMessage()"
                      >
                      <button class="send-btn" (click)="sendMessage()">
                        <i class="fas fa-paper-plane"></i>
                      </button>
                    </div>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .client-profile {
      margin-top: 80px;
    }

    .profile-header {
      background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
      padding: 4rem 0;
      color: white;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }

    .profile-info {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .avatar {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      border: 4px solid white;
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
      object-fit: cover;
    }

    .info h1 {
      margin-bottom: 0.5rem;
      font-size: 2.5rem;
    }

    .member-since {
      font-size: 1.2rem;
      opacity: 0.9;
    }

    .content {
      padding: 2rem;
      background: var(--background-color);
      min-height: 600px;
    }

    .profile-tabs {
      display: flex;
      border-bottom: 1px solid var(--border-color);
      margin-bottom: 2rem;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .profile-tabs::-webkit-scrollbar {
      display: none;
    }

    .tab-btn {
      padding: 1rem 1.5rem;
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      font-weight: 500;
      color: var(--text-light);
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;
    }

    .tab-btn.active {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }

    .tab-content {
      animation: fadeIn 0.5s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .profile-section {
      max-width: 800px;
      margin: 0 auto;
    }

    .profile-section h2 {
      margin-bottom: 1.5rem;
      color: var(--accent-color);
    }

    .personal-info {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .info-group {
      margin-bottom: 1.5rem;
    }

    .info-group label {
      display: block;
      font-size: 0.9rem;
      color: var(--text-light);
      margin-bottom: 0.5rem;
    }

    .info-group p {
      font-size: 1.1rem;
      margin: 0;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: var(--primary-color);
      color: white;
    }

    .btn-primary:hover {
      background: var(--accent-color);
    }

    .btn-outline {
      background: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-color);
    }

    .btn-outline:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      text-align: center;
    }

    .empty-state i {
      color: var(--text-light);
      margin-bottom: 1rem;
    }

    .empty-state p {
      color: var(--text-light);
      margin-bottom: 1.5rem;
      font-size: 1.1rem;
    }

    .empty-state.small {
      padding: 1.5rem;
    }

    .empty-state.small i {
      margin-bottom: 0.5rem;
    }

    .empty-state.small p {
      margin-bottom: 0;
      font-size: 0.9rem;
    }

    /* Styles pour l'onglet Commandes */
    .orders-section, .favorites-section, .messages-section {
      max-width: 1000px;
      margin: 0 auto;
    }

    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .order-card {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid var(--border-color);
    }

    .order-info h3 {
      margin: 0 0 0.5rem;
    }

    .order-date {
      color: var(--text-light);
      font-size: 0.9rem;
    }

    .order-status {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .order-status.en-cours {
      background: #FFF8E1;
      color: #FFA000;
    }

    .order-status.expédié {
      background: #E3F2FD;
      color: #1976D2;
    }

    .order-status.livré {
      background: #E8F5E9;
      color: #388E3C;
    }

    .order-status.annulé {
      background: #FFEBEE;
      color: #D32F2F;
    }

    .order-items {
      padding: 1.5rem;
    }

    .order-item {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-color);
    }

    .order-item:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }

    .item-image {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 4px;
    }

    .item-details {
      flex: 1;
    }

    .item-details h4 {
      margin: 0 0 0.25rem;
    }

    .item-artisan {
      color: var(--text-light);
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .item-price-qty {
      display: flex;
      justify-content: space-between;
    }

    .item-price {
      font-weight: 500;
    }

    .item-qty {
      color: var(--text-light);
    }

    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      background: var(--background-alt);
      border-top: 1px solid var(--border-color);
    }

    .order-total {
      display: flex;
      flex-direction: column;
    }

    .total-price {
      font-size: 1.2rem;
      font-weight: 500;
      color: var(--accent-color);
    }

    .order-actions {
      display: flex;
      gap: 1rem;
    }

    /* Styles pour l'onglet Favoris */
    .favorites-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 2rem;
    }

    .favorite-card {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .favorite-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
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

    .favorite-actions {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .favorite-card:hover .favorite-actions {
      opacity: 1;
    }

    .action-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: white;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .action-btn:hover {
      background: var(--primary-color);
      color: white;
    }

    .favorite-info {
      padding: 1.5rem;
    }

    .favorite-info h3 {
      margin: 0 0 0.5rem;
      font-size: 1.1rem;
    }

    .favorite-artisan {
      color: var(--text-light);
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .favorite-price {
      font-weight: 500;
      font-size: 1.1rem;
      margin-bottom: 1rem;
      color: var(--accent-color);
    }

    /* Styles pour l'onglet Messages */
    .messages-container {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 1.5rem;
      height: 600px;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .conversations-list {
      border-right: 1px solid var(--border-color);
      overflow-y: auto;
    }

    .conversation-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      cursor: pointer;
      transition: background 0.3s ease;
      border-bottom: 1px solid var(--border-color);
    }

    .conversation-item:hover, .conversation-item.active {
      background: var(--background-alt);
    }

    .conversation-avatar img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
    }

    .conversation-info {
      flex: 1;
      min-width: 0;
    }

    .conversation-info h4 {
      margin: 0 0 0.25rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .last-message {
      color: var(--text-light);
      font-size: 0.9rem;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .last-message.unread {
      font-weight: 500;
      color: var(--text-color);
    }

    .message-time {
      font-size: 0.8rem;
      color: var(--text-light);
    }

    .conversation-view {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .conversation-header {
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
    }

    .conversation-participant {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .conversation-participant img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .conversation-participant h3 {
      margin: 0;
    }

    .messages-list {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .message-bubble {
      max-width: 70%;
      align-self: flex-start;
    }

    .message-bubble.outgoing {
      align-self: flex-end;
    }

    .message-content {
      background: var(--background-alt);
      padding: 1rem;
      border-radius: 8px;
      position: relative;
    }

    .message-bubble.outgoing .message-content {
      background: var(--primary-color);
      color: white;
    }

    .message-content p {
      margin: 0 0 0.5rem;
    }

    .message-content .message-time {
      font-size: 0.8rem;
      opacity: 0.7;
      text-align: right;
    }

    .message-input {
      display: flex;
      padding: 1rem;
      border-top: 1px solid var(--border-color);
      gap: 0.5rem;
    }

    .message-input input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 1px solid var(--border-color);
      border-radius: 20px;
      outline: none;
    }

    .message-input input:focus {
      border-color: var(--primary-color);
    }

    .send-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--primary-color);
      color: white;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    @media (max-width: 768px) {
      .profile-info {
        flex-direction: column;
        text-align: center;
      }

      .messages-container {
        grid-template-columns: 1fr;
        height: auto;
      }

      .conversations-list {
        border-right: none;
        border-bottom: 1px solid var(--border-color);
        max-height: 300px;
      }

      .conversation-view {
        height: 400px;
      }
    }
  `]
})
export class ClientProfileComponent implements OnInit {
  client = {
    id: 1,
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    phone: '06 12 34 56 78',
    address: '123 rue de Paris, 75001 Paris',
    avatar: '/assets/avatar.jpg',
    memberSince: new Date('2023-01-15')
  };

  activeTab = 'profile';
  orders: any[] = [];
  favoriteItems: any[] = [];
  conversations: Conversation[] = [];
  selectedConversation: Conversation | null = null;
  newMessage = '';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public favoritesService: FavoritesService,
    public cartService: CartService,
    public messagingService: MessagingService
  ) {}

  ngOnInit(): void {
    // Vérifier s'il y a un onglet spécifié dans l'URL
    this.route.fragment.subscribe(fragment => {
      if (fragment && ['profile', 'orders', 'favorites', 'messages'].includes(fragment)) {
        this.activeTab = fragment;
      }
    });

    // Charger les données pour chaque onglet
    this.loadOrders();
    this.loadFavorites();
    this.loadConversations();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.router.navigate([], { fragment: tab });
  }

  // Méthodes pour l'onglet Commandes
  loadOrders(): void {
    // Simulation de données de commandes
    this.orders = [
      {
        id: 'CMD-2023-001',
        date: new Date('2023-05-15'),
        status: 'Livré',
        items: [
          {
            id: 1,
            name: 'Vase en céramique',
            artisan: 'Marie Dubois',
            price: 89.99,
            quantity: 1,
            image: '/assets/products/vase.jpg'
          },
          {
            id: 2,
            name: 'Bol en bois',
            artisan: 'Pierre Martin',
            price: 45.50,
            quantity: 2,
            image: '/assets/products/bowl.jpg'
          }
        ],
        total: 180.99
      },
      {
        id: 'CMD-2023-002',
        date: new Date('2023-06-20'),
        status: 'En cours',
        items: [
          {
            id: 3,
            name: 'Lampe artisanale',
            artisan: 'Sophie Leroy',
            price: 120.00,
            quantity: 1,
            image: '/assets/products/lamp.jpg'
          }
        ],
        total: 120.00
      }
    ];
  }

  // Méthodes pour l'onglet Favoris
  loadFavorites(): void {
    // Récupérer les IDs des favoris depuis le service
    const favoriteIds = this.favoritesService.getFavorites();
    
    // Simulation de données de produits favoris
    // Dans une application réelle, vous feriez un appel API pour récupérer les détails des produits
    this.favoriteItems = [
      {
        id: 1,
        title: 'Vase en céramique',
        artisan: 'Marie Dubois',
        price: 89.99,
        image: '/assets/products/vase.jpg'
      },
      {
        id: 3,
        title: 'Lampe artisanale',
        artisan: 'Sophie Leroy',
        price: 120.00,
        image: '/assets/products/lamp.jpg'
      },
      {
        id: 4,
        title: 'Bijou en argent',
        artisan: 'Luc Petit',
        price: 75.50,
        image: '/assets/products/jewelry.jpg'
      }
    ];
  }

  removeFromFavorites(productId: number): void {
    this.favoritesService.toggleFavorite(productId);
    this.favoriteItems = this.favoriteItems.filter(item => item.id !== productId);
  }

  addToCart(product: any): void {
    this.cartService.addToCart(product);
    // Afficher une notification de succès
    alert('Produit ajouté au panier');
  }

  // Méthodes pour l'onglet Messages
  loadConversations(): void {
    // Récupérer les conversations depuis le service de messagerie
    this.messagingService.getConversations().subscribe(conversations => {
      this.conversations = conversations;
      
      // Si aucune conversation n'existe, en créer quelques-unes pour la démo
      if (this.conversations.length <= 1) { // On garde la conversation existante et on en ajoute d'autres
        // Simulation de données de conversations
        const artisans = [
          {
            id: 101,
            name: 'Marie Dubois',
            avatar: '/assets/artisans/marie.jpg'
          },
          {
            id: 102,
            name: 'Pierre Martin',
            avatar: '/assets/artisans/pierre.jpg'
          },
          {
            id: 103,
            name: 'Sophie Leroy',
            avatar: '/assets/artisans/sophie.jpg'
          }
        ];

        // Créer des conversations avec chaque artisan
        artisans.forEach(artisan => {
          // Créer la conversation
          const conversationId = this.messagingService.createConversation(artisan);
          
          // Ajouter quelques messages pour la démo
          if (artisan.id === 101) {
            this.messagingService.sendMessage(
              conversationId,
              artisan.id,
              'Bonjour ! Merci pour votre commande de vase en céramique. Avez-vous des questions ?'
            );

            setTimeout(() => {
              this.messagingService.sendMessage(
                conversationId,
                artisan.id,
                'Votre commande sera expédiée demain et devrait arriver dans 3 jours ouvrables.'
              );
            }, 500);
          } else if (artisan.id === 102) {
            this.messagingService.sendMessage(
              conversationId,
              artisan.id,
              'Bonjour ! Je voulais vous informer que nos bols en bois sont disponibles en chêne clair, noyer et acajou.'
            );
          }
        });
      }
    });
  }

  selectConversation(conversation: Conversation): void {
    this.selectedConversation = conversation;
    
    // Marquer la conversation comme lue
    if (conversation && conversation.id) {
      this.messagingService.markConversationAsRead(conversation.id);
    }
  }

  getOtherParticipant(conversation: Conversation): any {
    return conversation.participants.find(p => p.id !== this.client.id) || {};
  }

  getConversationMessages(conversationId: number): any[] {
    // Stocker les messages temporairement
    const messages: any[] = [];
    
    // S'abonner aux messages de la conversation
    this.messagingService.getConversationMessages(conversationId).subscribe(msgs => {
      // Vider le tableau et ajouter les nouveaux messages
      messages.length = 0;
      messages.push(...msgs);
    });
    
    return messages;
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedConversation) return;
    
    // Trouver le destinataire (l'autre participant)
    const otherParticipant = this.getOtherParticipant(this.selectedConversation);
    
    // Envoyer le message
    this.messagingService.sendMessage(
      this.selectedConversation.id,
      otherParticipant.id,
      this.newMessage.trim()
    );
    
    // Vider le champ de message
    this.newMessage = '';
  }
}
