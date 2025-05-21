import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favorites: number[] = [];
  private favoritesSubject = new BehaviorSubject<number[]>([]);

  constructor() {
    // Charger les favoris depuis le localStorage au démarrage
    this.loadFavorites();
  }

  /**
   * Récupère tous les favoris
   */
  getFavorites(): Observable<number[]> {
    return this.favoritesSubject.asObservable();
  }

  /**
   * Vérifie si un produit est dans les favoris
   */
  isFavorite(productId: number): boolean {
    return this.favorites.includes(productId);
  }

  /**
   * Ajoute ou supprime un produit des favoris
   */
  toggleFavorite(productId: number): void {
    const index = this.favorites.indexOf(productId);
    
    if (index === -1) {
      // Ajouter aux favoris
      this.favorites.push(productId);
    } else {
      // Retirer des favoris
      this.favorites.splice(index, 1);
    }
    
    // Mettre à jour le subject et sauvegarder
    this.favoritesSubject.next([...this.favorites]);
    this.saveFavorites();
  }

  /**
   * Sauvegarde les favoris dans le localStorage
   */
  private saveFavorites(): void {
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  /**
   * Charge les favoris depuis le localStorage
   */
  private loadFavorites(): void {
    const storedFavorites = localStorage.getItem('favorites');
    
    if (storedFavorites) {
      try {
        this.favorites = JSON.parse(storedFavorites);
        this.favoritesSubject.next([...this.favorites]);
      } catch (error) {
        console.error('Erreur lors du chargement des favoris:', error);
      }
    }
  }

  /**
   * Supprime tous les favoris
   */
  clearFavorites(): void {
    this.favorites = [];
    this.favoritesSubject.next([]);
    localStorage.removeItem('favorites');
  }
}
