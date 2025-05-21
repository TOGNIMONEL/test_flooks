import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { FavoritesService } from '../../services/favorites.service';
import { OptimizedImageComponent } from '../optimized-image/optimized-image.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, OptimizedImageComponent],
  template: `
    <header class="header">
      <div class="container header-content">
        <a routerLink="/" class="logo">ArtisanatMarket</a>
        <button class="mobile-menu-toggle" (click)="toggleMobileMenu()" aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav [class.active]="mobileMenuOpen">
          <ul>
            <li><a routerLink="/explore">Explorer</a></li>
            <li><a routerLink="/explore">Artisans</a></li>
            @if (isLoggedIn) {
              <li><a routerLink="/client-profile">Mon Profil</a></li>
            } @else {
              <li><a routerLink="/auth/login">Se connecter</a></li>
            }
            <li><button class="btn btn-primary" routerLink="/auth/register">Devenir Artisan</button></li>
          </ul>
        </nav>
        <div class="header-actions">
          <div class="cart-icon" (click)="toggleCartDropdown()" #cartDropdownTrigger>
            <span class="material-icons-outlined">shopping_cart</span>
            @if (cartItemCount > 0) {
              <span class="badge">{{ cartItemCount }}</span>
            }
            <div class="dropdown-menu cart-dropdown" [class.active]="cartDropdownOpen">
              <h3>Mon Panier</h3>
              @if (cartItems.length === 0) {
                <p class="empty-cart">Votre panier est vide</p>
              } @else {
                <ul class="cart-items">
                  @for (item of cartItems; track item.id) {
                    <li class="cart-item">
                      <app-optimized-image 
                        [src]="item.image || '/assets/placeholder.jpg'" 
                        [alt]="item.name" 
                        className="item-image" 
                        position="thumbnail" 
                        [width]="40" 
                        [height]="40" 
                        [usePicture]="false"
                      ></app-optimized-image>
                      <div class="item-details">
                        <h4>{{ item.name }}</h4>
                        <p class="item-price">{{ item.price | currency:'EUR' }} x {{ item.quantity }}</p>
                      </div>
                      <button class="remove-btn" (click)="removeFromCart(item.id, $event)">
                        <span class="material-icons">close</span>
                      </button>
                    </li>
                  }
                </ul>
                <div class="cart-total">
                  <span>Total:</span>
                  <span>{{ cartTotal | currency:'EUR' }}</span>
                </div>
                <div class="cart-actions">
                  <button class="btn btn-outline" routerLink="/cart" (click)="cartDropdownOpen = false">
                    Voir le panier
                  </button>
                  <button class="btn btn-primary" routerLink="/checkout" (click)="cartDropdownOpen = false">
                    Commander
                  </button>
                </div>
              }
            </div>
          </div>
          
          <div class="profile-icon" (click)="toggleProfileDropdown()" #profileDropdownTrigger>
            <span class="material-icons-outlined">account_circle</span>
            <div class="dropdown-menu profile-dropdown" [class.active]="profileDropdownOpen">
              @if (isLoggedIn) {
                <div class="user-info">
                  <app-optimized-image 
                    [src]="userAvatar || '/assets/avatar.jpg'" 
                    alt="Avatar" 
                    className="user-avatar" 
                    position="above-fold" 
                    [width]="50" 
                    [height]="50" 
                    [usePicture]="false"
                  ></app-optimized-image>
                  <h3>{{ userName }}</h3>
                  <p>{{ userEmail }}</p>
                </div>
                <ul class="profile-menu">
                  <li>
                    <a routerLink="/client-profile" (click)="profileDropdownOpen = false">
                      <span class="material-icons">person</span> Mon profil
                    </a>
                  </li>
                  <li>
                    <a routerLink="/client-profile/favorites" (click)="profileDropdownOpen = false">
                      <span class="material-icons">favorite</span> Mes favoris
                      @if (favoritesCount > 0) {
                        <span class="count-badge">{{ favoritesCount }}</span>
                      }
                    </a>
                  </li>
                  <li>
                    <a routerLink="/client-profile/orders" (click)="profileDropdownOpen = false">
                      <span class="material-icons">shopping_bag</span> Mes commandes
                    </a>
                  </li>
                  <li>
                    <a routerLink="/client-profile/messages" (click)="profileDropdownOpen = false">
                      <span class="material-icons">email</span> Messages
                      @if (unreadMessagesCount > 0) {
                        <span class="count-badge">{{ unreadMessagesCount }}</span>
                      }
                    </a>
                  </li>
                  <li class="divider"></li>
                  <li>
                    <a (click)="logout()">
                      <span class="material-icons">logout</span> Déconnexion
                    </a>
                  </li>
                </ul>
              } @else {
                <div class="auth-buttons">
                  <button class="btn btn-outline" routerLink="/auth/login" (click)="profileDropdownOpen = false">
                    Se connecter
                  </button>
                  <button class="btn btn-primary" routerLink="/auth/register" (click)="profileDropdownOpen = false">
                    S'inscrire
                  </button>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: var(--background-color);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: fixed;
      width: 100%;
      top: 0;
      z-index: 1000;
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 80px;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      text-decoration: none;
      color: var(--accent-color);
    }

    nav ul {
      display: flex;
      gap: 2rem;
      list-style: none;
      align-items: center;
    }

    nav a {
      text-decoration: none;
      color: var(--text-color);
      font-weight: 500;
      transition: color 0.3s ease;
    }

    nav a:hover {
      color: var(--primary-color);
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    
    .cart-icon, .profile-icon {
      position: relative;
      font-size: 1.3rem;
      color: var(--text-color);
      cursor: pointer;
      transition: color 0.3s ease;
    }
    
    .cart-icon .material-icons-outlined, .profile-icon .material-icons-outlined {
      font-size: 1.4rem;
      opacity: 0.9;
    }
    
    .cart-icon:hover, .profile-icon:hover {
      color: var(--primary-color);
    }
    
    .badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background: var(--accent-color);
      color: white;
      font-size: 0.7rem;
      font-weight: bold;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .dropdown-menu {
      position: absolute;
      top: calc(100% + 10px);
      right: -10px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      width: 250px;
      padding: 0.75rem;
      z-index: 1001;
      opacity: 0;
      visibility: hidden;
      transform: translateY(10px);
      transition: all 0.3s ease;
    }
    
    .dropdown-menu.active {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    
    .dropdown-menu h3 {
      margin-top: 0;
      margin-bottom: 0.75rem;
      color: var(--accent-color);
      font-size: 1rem;
    }
    
    .empty-cart {
      text-align: center;
      color: var(--text-light);
      padding: 1rem 0;
    }
    
    .cart-items {
      list-style: none;
      padding: 0;
      margin: 0 0 0.75rem 0;
      max-height: 200px;
      overflow-y: auto;
    }
    
    .cart-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--border-color);
    }
    
    .cart-item:last-child {
      border-bottom: none;
    }
    
    .item-image {
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: 4px;
    }
    
    .item-details {
      flex: 1;
    }
    
    .item-details h4 {
      margin: 0 0 0.25rem;
      font-size: 0.85rem;
    }
    
    .item-price {
      margin: 0;
      font-size: 0.85rem;
      color: var(--text-light);
    }
    
    .remove-btn {
      background: none;
      border: none;
      color: var(--text-light);
      cursor: pointer;
      padding: 0.25rem;
      transition: color 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .remove-btn .material-icons {
      font-size: 0.9rem;
    }
    
    .remove-btn:hover {
      color: var(--accent-color);
    }
    
    .cart-total {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      margin-bottom: 1rem;
      padding-top: 0.5rem;
      border-top: 1px solid var(--border-color);
    }
    
    .cart-actions {
      display: flex;
      gap: 0.5rem;
    }
    
    .cart-actions .btn {
      flex: 1;
      padding: 0.5rem;
      font-size: 0.9rem;
    }
    
    .user-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-bottom: 1rem;
      margin-bottom: 1rem;
      border-bottom: 1px solid var(--border-color);
    }
    
    .user-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: 0.5rem;
      border: 1px solid var(--primary-color);
    }
    
    .user-info h3 {
      margin: 0.5rem 0 0.25rem;
      font-size: 0.95rem;
    }
    
    .user-info p {
      margin: 0;
      font-size: 0.9rem;
      color: var(--text-light);
    }
    
    .profile-menu {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .profile-menu li {
      margin-bottom: 0.5rem;
    }
    
    .profile-menu a {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      text-decoration: none;
      color: var(--text-color);
      border-radius: 4px;
      transition: background 0.3s ease;
      font-size: 0.9rem;
    }
    
    .profile-menu a:hover {
      background: var(--background-alt);
      color: var(--primary-color);
    }
    
    .profile-menu .material-icons {
      font-size: 1.1rem;
      width: 24px;
      text-align: center;
    }
    
    .count-badge {
      margin-left: auto;
      background: var(--primary-color);
      color: white;
      font-size: 0.7rem;
      padding: 0.1rem 0.4rem;
      border-radius: 10px;
    }
    
    .divider {
      height: 1px;
      background: var(--border-color);
      margin: 0.5rem 0;
    }
    
    .auth-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .mobile-menu-toggle {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      width: 30px;
      height: 24px;
      position: relative;
      z-index: 1001;
    }

    .mobile-menu-toggle span {
      display: block;
      width: 100%;
      height: 3px;
      background-color: var(--text-color);
      margin: 5px 0;
      transition: transform 0.3s ease, opacity 0.3s ease;
    }

    @media (max-width: 768px) {
      .mobile-menu-toggle {
        display: block;
      }

      nav {
        position: fixed;
        top: 0;
        right: -100%;
        width: 70%;
        height: 100vh;
        background-color: var(--background-color);
        box-shadow: -2px 0 5px rgba(0,0,0,0.1);
        padding: 80px 20px 20px;
        transition: right 0.3s ease;
        z-index: 1000;
      }

      nav.active {
        right: 0;
      }

      nav ul {
        flex-direction: column;
        align-items: flex-start;
        gap: 1.5rem;
      }

      .mobile-menu-toggle.active span:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
      }

      .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
      }

      .mobile-menu-toggle.active span:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  mobileMenuOpen = false;
  cartDropdownOpen = false;
  profileDropdownOpen = false;
  
  // Données utilisateur (simulées)
  isLoggedIn = true; // Simuler un utilisateur connecté
  userName = 'Jean Dupont';
  userEmail = 'jean.dupont@example.com';
  userAvatar = '/assets/avatar.jpg';
  
  // Données du panier et des favoris
  cartItems: any[] = [];
  cartItemCount = 0;
  cartTotal = 0;
  favoritesCount = 0;
  unreadMessagesCount = 2; // Simuler des messages non lus
  
  constructor(
    private cartService: CartService,
    private favoritesService: FavoritesService
  ) {}
  
  ngOnInit(): void {
    // Charger les données du panier
    this.loadCartData();
    
    // Charger les données des favoris
    this.loadFavoritesData();
    
    // Ajouter des écouteurs d'événements pour fermer les dropdowns lorsqu'on clique ailleurs
    document.addEventListener('click', this.closeDropdownsOnClickOutside.bind(this));
  }
  
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
  
  toggleCartDropdown(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.cartDropdownOpen = !this.cartDropdownOpen;
    if (this.cartDropdownOpen) {
      this.profileDropdownOpen = false;
    }
  }
  
  toggleProfileDropdown(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.profileDropdownOpen = !this.profileDropdownOpen;
    if (this.profileDropdownOpen) {
      this.cartDropdownOpen = false;
    }
  }
  
  closeDropdownsOnClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    
    // Vérifier si le clic est en dehors des dropdowns
    if (!target.closest('.cart-icon') && !target.closest('.profile-icon')) {
      this.cartDropdownOpen = false;
      this.profileDropdownOpen = false;
    }
  }
  
  loadCartData(): void {
    // Récupérer les données du panier
    // Comme le service retourne un Observable, nous devons nous y abonner
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.cartItemCount = this.cartItems.reduce((total, item) => total + item.quantity, 0);
      this.cartTotal = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    });
  }
  
  loadFavoritesData(): void {
    // Récupérer les données des favoris
    // Comme le service retourne un Observable, nous devons nous y abonner
    this.favoritesService.getFavorites().subscribe(favorites => {
      this.favoritesCount = favorites.length;
    });
  }
  
  removeFromCart(productId: number, event: Event): void {
    event.stopPropagation(); // Empêcher la fermeture du dropdown
    this.cartService.removeFromCart(productId);
    // Recharger les données du panier après suppression
    this.loadCartData();
  }
  
  logout(): void {
    // Dans une application réelle, vous utiliseriez un service d'authentification
    this.isLoggedIn = false;
    this.profileDropdownOpen = false;
    // Rediriger vers la page d'accueil ou de connexion
  }
}