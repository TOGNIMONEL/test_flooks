import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  constructor() {
    // Charger le panier depuis le localStorage au démarrage
    this.loadCart();
  }

  /**
   * Récupère tous les éléments du panier
   */
  getCartItems(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  /**
   * Récupère le nombre total d'articles dans le panier
   */
  getCartItemCount(): Observable<number> {
    return this.cartSubject.pipe(
      map(items => items.reduce((count, item) => count + item.quantity, 0))
    );
  }

  /**
   * Récupère le montant total du panier
   */
  getCartTotal(): Observable<number> {
    return this.cartSubject.pipe(
      map(items => items.reduce((total, item) => total + (item.price * item.quantity), 0))
    );
  }

  /**
   * Ajoute un produit au panier
   */
  addToCart(product: any): void {
    const existingItem = this.cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      // Si le produit existe déjà, augmenter la quantité
      existingItem.quantity += 1;
    } else {
      // Sinon, ajouter le nouveau produit
      this.cartItems.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }
    
    // Mettre à jour le subject et sauvegarder
    this.cartSubject.next([...this.cartItems]);
    this.saveCart();
  }

  /**
   * Supprime un produit du panier
   */
  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.id !== productId);
    this.cartSubject.next([...this.cartItems]);
    this.saveCart();
  }

  /**
   * Met à jour la quantité d'un produit dans le panier
   */
  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    
    const item = this.cartItems.find(item => item.id === productId);
    
    if (item) {
      item.quantity = quantity;
      this.cartSubject.next([...this.cartItems]);
      this.saveCart();
    }
  }

  /**
   * Vide le panier
   */
  clearCart(): void {
    this.cartItems = [];
    this.cartSubject.next([]);
    localStorage.removeItem('cart');
  }

  /**
   * Sauvegarde le panier dans le localStorage
   */
  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  /**
   * Charge le panier depuis le localStorage
   */
  private loadCart(): void {
    const storedCart = localStorage.getItem('cart');
    
    if (storedCart) {
      try {
        this.cartItems = JSON.parse(storedCart);
        this.cartSubject.next([...this.cartItems]);
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
      }
    }
  }
}
