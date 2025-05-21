import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ArtisanBadgeComponent, Badge } from '../../components/artisan-badge/artisan-badge.component';
import { BadgeService } from '../../services/badge.service';
import { FavoritesService } from '../../services/favorites.service';
import { CartService } from '../../services/cart.service';
import { ReviewsService, RatingDistribution } from '../../services/reviews.service';
import { MessagingService } from '../../services/messaging.service';

@Component({
  selector: 'app-artisan-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ArtisanBadgeComponent],
  template: `
    <div class="artisan-profile">
      <div class="profile-header">
        <div class="container">
          <div class="profile-info">
            <img [src]="artisan.avatar" [alt]="artisan.name" class="avatar">
            <div class="info">
              <h1>{{ artisan.name }}</h1>
              <p class="specialty">{{ artisan.specialty }}</p>
              <div class="rating">
                <span class="stars">
                  @for (star of [1, 2, 3, 4, 5]; track star) {
                    <i class="fas fa-star" [class.active]="star <= artisan.rating"></i>
                  }
                </span>
                <span class="rating-value">{{ artisan.rating }}/5</span>
                <span class="reviews-count">({{ artisan.reviewsCount }} avis)</span>
              </div>
              <div class="badges-container">
                @for (badge of artisanBadges; track badge.id) {
                  <app-artisan-badge [badge]="badge"></app-artisan-badge>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container content">
        <div class="profile-tabs">
          <button 
            class="tab-btn" 
            [class.active]="activeTab === 'about'" 
            (click)="setActiveTab('about')">À propos</button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab === 'creations'" 
            (click)="setActiveTab('creations')">Créations</button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab === 'contact'" 
            (click)="setActiveTab('contact')">Contact</button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab === 'reviews'" 
            (click)="setActiveTab('reviews')">Avis</button>
        </div>

        <div class="tab-content">
          <!-- Onglet À propos -->
          @if (activeTab === 'about') {
            <div class="bio">
              <h2>À propos</h2>
              <p>{{ artisan.bio }}</p>
              
              <div class="artisan-details">
                <div class="detail-item">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>{{ artisan.location }}</span>
                </div>
                <div class="detail-item">
                  <i class="fas fa-calendar-alt"></i>
                  <span>{{ artisan.experience }} ans d'expérience</span>
                </div>
                @if (artisan.certificates && artisan.certificates.length > 0) {
                  <div class="detail-item">
                    <i class="fas fa-award"></i>
                    <span>{{ artisan.certificates.join(', ') }}</span>
                  </div>
                }
              </div>
              
              <div class="specialties">
                <h3>Spécialités</h3>
                <div class="tags">
                  @for (specialty of artisan.specialties; track specialty) {
                    <span class="tag">{{ specialty }}</span>
                  }
                </div>
              </div>
            </div>
          }

          <!-- Onglet Créations -->
          @if (activeTab === 'creations') {
            <div class="gallery">
              <h2>Mes Créations</h2>
              <div class="works-grid">
                @for (work of artisan.works; track work.id) {
                  <div class="work-card">
                    <div class="work-image">
                      <img [src]="work.image" [alt]="work.title">
                      <div class="work-actions">
                        <button class="action-btn" [routerLink]="['/product', work.id]">
                          <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn" (click)="addToFavorites(work)">
                          <i class="fas" [class.fa-heart]="isInFavorites(work.id)" [class.fa-heart-o]="!isInFavorites(work.id)"></i>
                        </button>
                      </div>
                    </div>
                    <div class="work-info">
                      <h3>{{ work.title }}</h3>
                      <p class="work-description">{{ work.description }}</p>
                      <div class="work-price">{{ work.price | currency:'EUR' }}</div>
                      <button class="btn btn-primary btn-sm" (click)="addToCart(work)">
                        <i class="fas fa-shopping-cart"></i> Ajouter au panier
                      </button>
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          <!-- Onglet Contact -->
          @if (activeTab === 'contact') {
            <div class="contact">
              <h2>Contact</h2>
              <div class="contact-info">
                <div class="info-item">
                  <i class="fas fa-envelope"></i>
                  <span>{{ artisan.email }}</span>
                </div>
                <div class="info-item">
                  <i class="fas fa-phone"></i>
                  <span>{{ artisan.phone }}</span>
                </div>
                <div class="info-item">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>{{ artisan.address }}</span>
                </div>
              </div>
              
              <div class="messaging">
                <h3>Envoyer un message</h3>
                <div class="chat-window">
                  @for (message of messagingService.getConversationMessages(conversationId) | async; track message.id) {
                    <div class="message" [class.sent]="message.senderId === 999">
                      <img [src]="message.senderAvatar" [alt]="message.senderName" class="message-avatar">
                      <div class="message-content">
                        <p>{{ message.text }}</p>
                        <span class="time">{{ message.timestamp | date:'HH:mm' }}</span>
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
                  <button class="btn btn-primary" (click)="sendMessage()">
                    <i class="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </div>
          }

          <!-- Onglet Avis -->
          @if (activeTab === 'reviews') {
            <div class="reviews">
              <h2>Avis clients</h2>
              <div class="reviews-summary">
                <div class="rating-summary">
                  <div class="average-rating">
                    <span class="rating-number">{{ artisan.rating }}</span>
                    <div class="stars">
                      @for (star of [1, 2, 3, 4, 5]; track star) {
                        <i class="fas fa-star" [class.active]="star <= artisan.rating"></i>
                      }
                    </div>
                    <span class="total-reviews">{{ artisan.reviewsCount }} avis</span>
                  </div>
                  <div class="rating-bars">
                    @for (bar of ratingDistribution; track bar.rating) {
                      <div class="rating-bar">
                        <span class="rating-label">{{ bar.rating }}</span>
                        <div class="bar-container">
                          <div class="bar" [style.width.%]="bar.percentage"></div>
                        </div>
                        <span class="rating-count">{{ bar.count }}</span>
                      </div>
                    }
                  </div>
                </div>
              </div>

              <div class="reviews-list">
                @for (review of reviewsService.getArtisanReviews(artisan.id) | async; track review.id) {
                  <div class="review-card">
                    <div class="review-header">
                      <img [src]="review.avatar" [alt]="review.name" class="reviewer-avatar">
                      <div class="reviewer-info">
                        <h4>{{ review.name }}</h4>
                        <div class="review-stars">
                          @for (star of [1, 2, 3, 4, 5]; track star) {
                            <i class="fas fa-star" [class.active]="star <= review.rating"></i>
                          }
                        </div>
                        <span class="review-date">{{ review.date | date:'dd/MM/yyyy' }}</span>
                      </div>
                    </div>
                    <div class="review-content">
                      <p>{{ review.text }}</p>
                    </div>
                    @if (review.response) {
                      <div class="review-response">
                        <div class="response-header">
                          <img [src]="artisan.avatar" [alt]="artisan.name" class="reviewer-avatar">
                          <div class="reviewer-info">
                            <h4>{{ artisan.name }}</h4>
                            <span class="review-date">{{ review.responseDate | date:'dd/MM/yyyy' }}</span>
                          </div>
                        </div>
                        <div class="response-content">
                          <p>{{ review.response }}</p>
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          }
      </div>
    </div>
  `,
  styles: [`
    .artisan-profile {
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

    .specialty {
      font-size: 1.2rem;
      opacity: 0.9;
      margin-bottom: 0.5rem;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .stars {
      display: flex;
    }

    .stars i {
      color: rgba(255,255,255,0.3);
      margin-right: 2px;
    }

    .stars i.active {
      color: var(--primary-color);
    }

    .rating-value, .reviews-count {
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .badges-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 1rem;
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

    /* Styles pour l'onglet À propos */
    .bio {
      margin-bottom: 2rem;
    }

    .bio h2 {
      margin-bottom: 1rem;
      color: var(--accent-color);
    }

    .bio p {
      line-height: 1.8;
      margin-bottom: 2rem;
    }

    .artisan-details {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .detail-item i {
      color: var(--primary-color);
    }

    .specialties h3 {
      margin-bottom: 1rem;
      font-size: 1.2rem;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tag {
      background: var(--background-alt);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
    }

    /* Styles pour l'onglet Créations */
    .works-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2rem;
    }

    .work-card {
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      background: white;
    }

    .work-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.15);
    }

    .work-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .work-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .work-card:hover .work-image img {
      transform: scale(1.05);
    }

    .work-actions {
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

    .work-card:hover .work-actions {
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

    .work-info {
      padding: 1.5rem;
    }

    .work-info h3 {
      margin-bottom: 0.5rem;
      font-size: 1.2rem;
    }

    .work-description {
      margin-bottom: 1rem;
      color: var(--text-light);
      font-size: 0.9rem;
    }

    .work-price {
      font-weight: bold;
      font-size: 1.2rem;
      margin-bottom: 1rem;
      color: var(--accent-color);
    }

    /* Styles pour l'onglet Contact */
    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: var(--background-alt);
      border-radius: 8px;
    }

    .info-item i {
      font-size: 1.2rem;
      color: var(--primary-color);
    }

    .messaging {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .messaging h3 {
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
    }

    .chat-window {
      height: 400px;
      overflow-y: auto;
      padding: 1rem;
    }

    .message {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .message.sent {
      flex-direction: row-reverse;
    }

    .message-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .message-content {
      background: var(--background-alt);
      padding: 1rem;
      border-radius: 8px;
      max-width: 70%;
    }

    .sent .message-content {
      background: var(--primary-color);
      color: var(--accent-color);
    }

    .time {
      display: block;
      font-size: 0.8rem;
      opacity: 0.7;
      margin-top: 0.5rem;
      text-align: right;
    }

    .message-input {
      display: flex;
      padding: 1rem;
      border-top: 1px solid var(--border-color);
    }

    .message-input input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 1px solid var(--border-color);
      border-radius: 20px;
      margin-right: 1rem;
      outline: none;
    }

    .message-input input:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
    }

    /* Styles pour l'onglet Avis */
    .reviews-summary {
      margin-bottom: 2rem;
      background: var(--background-alt);
      padding: 1.5rem;
      border-radius: 8px;
    }

    .rating-summary {
      display: flex;
      gap: 2rem;
    }

    .average-rating {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-right: 2rem;
      border-right: 1px solid var(--border-color);
    }

    .rating-number {
      font-size: 3rem;
      font-weight: bold;
      line-height: 1;
      margin-bottom: 0.5rem;
    }

    .total-reviews {
      font-size: 0.9rem;
      color: var(--text-light);
    }

    .rating-bars {
      flex: 1;
    }

    .rating-bar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .rating-label {
      width: 15px;
      text-align: right;
    }

    .bar-container {
      flex: 1;
      height: 8px;
      background: #ddd;
      border-radius: 4px;
      overflow: hidden;
    }

    .bar {
      height: 100%;
      background: var(--primary-color);
    }

    .rating-count {
      width: 30px;
      font-size: 0.9rem;
      color: var(--text-light);
    }

    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .review-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .review-header {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .reviewer-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
    }

    .reviewer-info h4 {
      margin: 0 0 0.25rem;
    }

    .review-stars {
      display: flex;
      margin-bottom: 0.25rem;
    }

    .review-stars i {
      color: #ddd;
      font-size: 0.9rem;
    }

    .review-stars i.active {
      color: var(--primary-color);
    }

    .review-date {
      font-size: 0.8rem;
      color: var(--text-light);
    }

    .review-content {
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .review-response {
      background: var(--background-alt);
      padding: 1rem;
      border-radius: 8px;
      margin-left: 2rem;
    }

    .response-header {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .response-content {
      font-style: italic;
    }

    @media (max-width: 768px) {
      .profile-info {
        flex-direction: column;
        text-align: center;
      }

      .rating-summary {
        flex-direction: column;
      }

      .average-rating {
        padding-right: 0;
        border-right: none;
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 1rem;
        margin-bottom: 1rem;
      }

      .work-card {
        max-width: 350px;
        margin: 0 auto;
      }
    }
  `]
})
export class ArtisanProfileComponent implements OnInit {
  artisan = {
    id: 1,
    name: 'Marie Dubois',
    specialty: 'Céramiste',
    avatar: '/assets/artisan1.jpg',
    bio: 'Artisan céramiste depuis plus de 10 ans, je crée des pièces uniques inspirées par la nature et les traditions méditerranéennes. Chaque création est façonnée à la main dans mon atelier à Lyon.',
    email: 'marie.dubois@artisanat.fr',
    phone: '06 12 34 56 78',
    address: '15 rue des Artisans, 69001 Lyon',
    location: 'Lyon, France',
    experience: 10,
    rating: 4.8,
    reviewsCount: 124,
    specialties: ['Céramique', 'Poterie', 'Art de la table', 'Décoration'],
    certificates: ['Meilleur Ouvrier de France', 'Artisan d\'Art'],
    works: [
      {
        id: 1,
        title: 'Collection Printemps',
        description: 'Ensemble de vases aux couleurs pastel inspirés par les fleurs printanières',
        image: '/assets/favorite1.jpg',
        price: 89.90
      },
      {
        id: 2,
        title: 'Série Océan',
        description: 'Bols aux teintes bleues et textures ondulées évoquant les vagues de l\'océan',
        image: '/assets/favorite2.jpg',
        price: 45.50
      },
      {
        id: 3,
        title: 'Vases Terracotta',
        description: 'Vases minimalistes en terre cuite naturelle avec finition mate',
        image: '/assets/favorite3.jpg',
        price: 65.00
      },
      {
        id: 4,
        title: 'Service à thé Zen',
        description: 'Ensemble théière et tasses en grès émaillé, inspiré des traditions japonaises',
        image: '/assets/favorite4.jpg',
        price: 120.00
      }
    ],
    reviews: [
      {
        id: 1,
        name: 'Sophie Martin',
        avatar: '/assets/user1.jpg',
        rating: 5,
        date: new Date('2024-03-15'),
        text: 'J\'ai commandé un service complet pour ma nouvelle maison et je suis enchantée ! La qualité est exceptionnelle et Marie a été très à l\'écoute de mes besoins.',
        response: 'Merci beaucoup Sophie ! C\'était un plaisir de travailler sur ce projet avec vous.',
        responseDate: new Date('2024-03-16')
      },
      {
        id: 2,
        name: 'Thomas Durand',
        avatar: '/assets/user2.jpg',
        rating: 4,
        date: new Date('2024-02-28'),
        text: 'Très belle collection Océan, les couleurs sont magnifiques. Seul petit bémol sur le délai de livraison un peu long.'
      },
      {
        id: 3,
        name: 'Emma Petit',
        avatar: '/assets/user3.jpg',
        rating: 5,
        date: new Date('2024-02-10'),
        text: 'Des pièces uniques d\'une grande finesse. On sent le savoir-faire et la passion dans chaque création. Je recommande vivement !',
        response: 'Merci Emma pour ce retour chaleureux ! Je suis ravie que mes créations vous plaisent.',
        responseDate: new Date('2024-02-11')
      }
    ]
  };

  messages = [
    {
      id: 1,
      name: 'Marie Dubois',
      avatar: '/assets/artisan1.jpg',
      text: 'Bonjour ! Comment puis-je vous aider ?',
      time: '10:30',
      sent: false
    },
    {
      id: 2,
      name: 'Vous',
      avatar: '/assets/avatar.jpg',
      text: 'Bonjour, je suis intéressé par votre collection Printemps. Est-elle disponible ?',
      time: '10:32',
      sent: true
    },
    {
      id: 3,
      name: 'Marie Dubois',
      avatar: '/assets/artisan1.jpg',
      text: 'Oui, elle est disponible ! Je peux vous proposer une personnalisation si vous le souhaitez.',
      time: '10:35',
      sent: false
    }
  ];

  newMessage = '';
  activeTab = 'about';
  artisanBadges: Badge[] = [];
  ratingDistribution: RatingDistribution[] = [];
  conversationId = 1; // ID de la conversation avec l'artisan actuel

  constructor(
    private badgeService: BadgeService,
    private route: ActivatedRoute,
    public favoritesService: FavoritesService,
    public cartService: CartService,
    public reviewsService: ReviewsService,
    public messagingService: MessagingService
  ) {}

  ngOnInit(): void {
    // Récupération des badges de l'artisan
    this.assignBadgesToArtisan();

    // Récupération de la distribution des notes
    this.ratingDistribution = this.reviewsService.getRatingDistribution(1); // 1 est l'ID de l'artisan actuel

    // Marquer la conversation comme lue
    this.messagingService.markConversationAsRead(this.conversationId);

    // Vérifier s'il y a un onglet spécifié dans l'URL
    this.route.fragment.subscribe(fragment => {
      if (fragment && ['about', 'creations', 'contact', 'reviews'].includes(fragment)) {
        this.activeTab = fragment;
      }
    });

    console.log('ArtisanProfileComponent initialized with badges:', this.artisanBadges);
  }
  
  // Méthode pour attribuer des badges à l'artisan
  private assignBadgesToArtisan(): void {
    // Récupérer tous les badges disponibles
    const allBadges = this.badgeService.getAllBadges();
    const badgeIds: string[] = [];
    
    // Ajouter les badges en fonction des attributs de l'artisan
    if (this.artisan.experience >= 10) {
      badgeIds.push('expert');
    }
    
    if (this.artisan.rating >= 4.5) {
      badgeIds.push('quality');
    }
    
    // Ajouter le badge MOF si l'artisan a la certification
    if (this.artisan.certificates && 
        this.artisan.certificates.some((cert: string) => cert.includes('Meilleur Ouvrier de France'))) {
      badgeIds.push('mof');
    }
    
    // Par défaut, tous les artisans sont certifiés sur notre plateforme
    badgeIds.push('certified');
    
    // Par défaut, tous les artisans utilisent des méthodes 100% manuelles
    badgeIds.push('handmade');
    
    // Filtrer les badges pour ne garder que ceux qui correspondent aux IDs sélectionnés
    this.artisanBadges = allBadges.filter(badge => badgeIds.includes(badge.id));
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      // Utiliser le service de messagerie pour envoyer le message
      this.messagingService.sendMessage(
        this.conversationId,
        this.artisan.id || 1, // Utiliser l'ID de l'artisan ou 1 par défaut
        this.newMessage
      );
      
      this.newMessage = '';
    }
  }

  addToFavorites(work: any): void {
    this.favoritesService.toggleFavorite(work.id);
    console.log(`${this.isInFavorites(work.id) ? 'Ajouté aux' : 'Retiré des'} favoris: ${work.title}`);
  }

  isInFavorites(id: number): boolean {
    return this.favoritesService.isFavorite(id);
  }

  addToCart(work: any): void {
    this.cartService.addToCart(work);
    console.log(`Ajouté au panier: ${work.title}`);
  }
}
