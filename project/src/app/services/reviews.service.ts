import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Review {
  id: number;
  artisanId: number;
  name: string;
  avatar: string;
  rating: number;
  date: Date;
  text: string;
  response?: string;
  responseDate?: Date;
}

export interface RatingDistribution {
  rating: number;
  count: number;
  percentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private reviews: Review[] = [
    {
      id: 1,
      artisanId: 1,
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
      artisanId: 1,
      name: 'Thomas Durand',
      avatar: '/assets/user2.jpg',
      rating: 4,
      date: new Date('2024-02-28'),
      text: 'Très belle collection Océan, les couleurs sont magnifiques. Seul petit bémol sur le délai de livraison un peu long.'
    },
    {
      id: 3,
      artisanId: 1,
      name: 'Emma Petit',
      avatar: '/assets/user3.jpg',
      rating: 5,
      date: new Date('2024-02-10'),
      text: 'Des pièces uniques d\'une grande finesse. On sent le savoir-faire et la passion dans chaque création. Je recommande vivement !',
      response: 'Merci Emma pour ce retour chaleureux ! Je suis ravie que mes créations vous plaisent.',
      responseDate: new Date('2024-02-11')
    },
    {
      id: 4,
      artisanId: 1,
      name: 'Lucas Moreau',
      avatar: '/assets/user4.jpg',
      rating: 3,
      date: new Date('2024-01-20'),
      text: 'Produits de qualité mais un peu chers par rapport à la concurrence. Le service client est cependant excellent.'
    }
  ];

  private reviewsSubject = new BehaviorSubject<Review[]>(this.reviews);

  constructor() {}

  /**
   * Récupère tous les avis
   */
  getAllReviews(): Observable<Review[]> {
    return this.reviewsSubject.asObservable();
  }

  /**
   * Récupère les avis d'un artisan spécifique
   */
  getArtisanReviews(artisanId: number): Observable<Review[]> {
    const filteredReviews = this.reviews.filter(review => review.artisanId === artisanId);
    return new BehaviorSubject<Review[]>(filteredReviews).asObservable();
  }

  /**
   * Calcule la note moyenne d'un artisan
   */
  getArtisanRating(artisanId: number): number {
    const artisanReviews = this.reviews.filter(review => review.artisanId === artisanId);
    
    if (artisanReviews.length === 0) {
      return 0;
    }
    
    const sum = artisanReviews.reduce((total, review) => total + review.rating, 0);
    return parseFloat((sum / artisanReviews.length).toFixed(1));
  }

  /**
   * Calcule la distribution des notes pour un artisan
   */
  getRatingDistribution(artisanId: number): RatingDistribution[] {
    const artisanReviews = this.reviews.filter(review => review.artisanId === artisanId);
    const totalReviews = artisanReviews.length;
    
    if (totalReviews === 0) {
      return [
        { rating: 5, count: 0, percentage: 0 },
        { rating: 4, count: 0, percentage: 0 },
        { rating: 3, count: 0, percentage: 0 },
        { rating: 2, count: 0, percentage: 0 },
        { rating: 1, count: 0, percentage: 0 }
      ];
    }
    
    // Initialiser la distribution
    const distribution: RatingDistribution[] = [];
    
    for (let i = 5; i >= 1; i--) {
      const count = artisanReviews.filter(review => review.rating === i).length;
      const percentage = Math.round((count / totalReviews) * 100);
      
      distribution.push({
        rating: i,
        count,
        percentage
      });
    }
    
    return distribution;
  }

  /**
   * Ajoute un nouvel avis
   */
  addReview(review: Omit<Review, 'id' | 'date'>): void {
    const newReview: Review = {
      ...review,
      id: this.getNextId(),
      date: new Date()
    };
    
    this.reviews.push(newReview);
    this.reviewsSubject.next([...this.reviews]);
  }

  /**
   * Ajoute une réponse à un avis
   */
  addResponse(reviewId: number, response: string): void {
    const review = this.reviews.find(r => r.id === reviewId);
    
    if (review) {
      review.response = response;
      review.responseDate = new Date();
      this.reviewsSubject.next([...this.reviews]);
    }
  }

  /**
   * Génère le prochain ID disponible
   */
  private getNextId(): number {
    return Math.max(...this.reviews.map(review => review.id), 0) + 1;
  }
}
