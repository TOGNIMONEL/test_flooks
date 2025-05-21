import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="explore-container">
      <div class="filters-sidebar">
        <div class="filters-header">
          <h2>Filtres</h2>
          <button class="btn-reset" (click)="resetFilters()">Réinitialiser</button>
        </div>
        
        <div class="filter-group">
          <h3>Catégories</h3>
          <div class="checkbox-list">
            @for (category of categories; track category.id) {
              <label class="checkbox-item">
                <input 
                  type="checkbox" 
                  [checked]="selectedCategories.includes(category.id)"
                  (change)="toggleCategory(category.id)">
                <span>{{ category.name }}</span>
                <span class="count">({{ category.count }})</span>
              </label>
            }
          </div>
        </div>
        
        <div class="filter-group">
          <h3>Prix</h3>
          <div class="price-range">
            <input 
              type="range" 
              [min]="priceRange.min" 
              [max]="priceRange.max" 
              [(ngModel)]="priceRange.current" 
              (input)="updatePriceFilter()">
            <div class="price-inputs">
              <span>{{ priceRange.min }}€</span>
              <span>{{ priceRange.current }}€</span>
            </div>
          </div>
        </div>
        
        <div class="filter-group">
          <h3>Artisans certifiés</h3>
          <label class="switch">
            <input type="checkbox" [(ngModel)]="onlyCertified" (change)="applyFilters()">
            <span class="slider round"></span>
          </label>
        </div>
        
        <div class="filter-group">
          <h3>Matériaux</h3>
          <div class="checkbox-list">
            @for (material of materials; track material.id) {
              <label class="checkbox-item">
                <input 
                  type="checkbox" 
                  [checked]="selectedMaterials.includes(material.id)"
                  (change)="toggleMaterial(material.id)">
                <span>{{ material.name }}</span>
              </label>
            }
          </div>
        </div>
      </div>
      
      <div class="products-grid">
        <div class="grid-header">
          <h1>Explorez nos créations</h1>
          <div class="grid-controls">
            <div class="sort-by">
              <label>Trier par:</label>
              <select [(ngModel)]="sortBy" (change)="applyFilters()">
                <option value="popular">Popularité</option>
                <option value="recent">Plus récents</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
              </select>
            </div>
            <div class="view-mode">
              <button 
                class="view-btn" 
                [class.active]="viewMode === 'grid'"
                (click)="viewMode = 'grid'">
                <i class="fas fa-th"></i>
              </button>
              <button 
                class="view-btn" 
                [class.active]="viewMode === 'list'"
                (click)="viewMode = 'list'">
                <i class="fas fa-list"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div class="products" [class]="viewMode">
          @for (product of filteredProducts; track product.id) {
            <div class="product-card" [routerLink]="['/product', product.id]">
              <div class="product-image">
                <img [src]="product.image" [alt]="product.name">
                @if (product.artisanCertified) {
                  <div class="certified-badge">
                    <i class="fas fa-certificate"></i>
                  </div>
                }
              </div>
              <div class="product-info">
                <h3>{{ product.name }}</h3>
                <p class="artisan">par {{ product.artisanName }}</p>
                <div class="rating">
                  @for (i of [1, 2, 3, 4, 5]; track i) {
                    <i class="fas fa-star" [class.active]="i <= product.rating"></i>
                  }
                  <span>({{ product.reviewCount }})</span>
                </div>
                <p class="price">{{ product.price | currency:'EUR':'symbol':'1.0-2':'fr' }}</p>
              </div>
            </div>
          }
        </div>
        
        @if (filteredProducts.length === 0) {
          <div class="no-results">
            <i class="fas fa-search"></i>
            <h3>Aucun résultat trouvé</h3>
            <p>Essayez de modifier vos filtres pour voir plus de produits.</p>
            <button class="btn btn-primary" (click)="resetFilters()">Réinitialiser les filtres</button>
          </div>
        }
        
        <div class="pagination">
          @for (page of pages; track page) {
            <button 
              class="page-btn" 
              [class.active]="currentPage === page"
              (click)="goToPage(page)">
              {{ page }}
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .explore-container {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 2rem;
      margin-top: 80px;
      padding: 2rem;
    }

    .filters-sidebar {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      height: fit-content;
      position: sticky;
      top: 100px;
    }

    .filters-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .filters-header h2 {
      margin: 0;
      font-size: 1.5rem;
    }

    .btn-reset {
      background: none;
      border: none;
      color: #666;
      cursor: pointer;
      font-size: 0.9rem;
      text-decoration: underline;
    }

    .filter-group {
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #eee;
    }

    .filter-group:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .filter-group h3 {
      margin: 0 0 1rem;
      font-size: 1.1rem;
      color: #333;
    }

    .checkbox-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .checkbox-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .count {
      color: #999;
      font-size: 0.9rem;
    }

    .price-range {
      padding: 0 0.5rem;
    }

    .price-inputs {
      display: flex;
      justify-content: space-between;
      margin-top: 0.5rem;
    }

    .switch {
      position: relative;
      display: inline-block;
      width: 50px;
      height: 24px;
    }

    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: .4s;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .4s;
    }

    input:checked + .slider {
      background-color: var(--primary-color);
    }

    input:checked + .slider:before {
      transform: translateX(26px);
    }

    .slider.round {
      border-radius: 24px;
    }

    .slider.round:before {
      border-radius: 50%;
    }

    .products-grid {
      flex: 1;
    }

    .grid-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .grid-header h1 {
      margin: 0;
      font-size: 2rem;
    }

    .grid-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .sort-by {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .sort-by select {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
    }

    .view-mode {
      display: flex;
      gap: 0.5rem;
    }

    .view-btn {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .view-btn.active {
      background: var(--primary-color);
      color: var(--accent-color);
      border-color: var(--primary-color);
    }

    .products {
      display: grid;
      gap: 2rem;
    }

    .products.grid {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }

    .products.list {
      grid-template-columns: 1fr;
    }

    .product-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
    }

    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    }

    .products.list .product-card {
      display: grid;
      grid-template-columns: 200px 1fr;
    }

    .product-image {
      position: relative;
      height: 200px;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .certified-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 30px;
      height: 30px;
      background: var(--primary-color);
      color: var(--accent-color);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .product-info {
      padding: 1rem;
    }

    .product-info h3 {
      margin: 0 0 0.5rem;
      font-size: 1.2rem;
    }

    .artisan {
      color: #666;
      font-size: 0.9rem;
      margin: 0 0 0.5rem;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      margin-bottom: 0.5rem;
    }

    .rating .fa-star {
      color: #ddd;
      font-size: 0.9rem;
    }

    .rating .fa-star.active {
      color: var(--primary-color);
    }

    .rating span {
      color: #666;
      font-size: 0.8rem;
    }

    .price {
      font-weight: bold;
      font-size: 1.1rem;
      margin: 0.5rem 0 0;
    }

    .no-results {
      text-align: center;
      padding: 3rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }

    .no-results i {
      font-size: 3rem;
      color: #ddd;
      margin-bottom: 1rem;
    }

    .pagination {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 2rem;
    }

    .page-btn {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .page-btn.active {
      background: var(--primary-color);
      color: var(--accent-color);
      border-color: var(--primary-color);
    }

    @media (max-width: 992px) {
      .explore-container {
        grid-template-columns: 1fr;
      }

      .filters-sidebar {
        position: static;
        margin-bottom: 2rem;
      }
    }

    @media (max-width: 768px) {
      .products.grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      }

      .products.list .product-card {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ExploreComponent implements OnInit {
  categories = [
    { id: 1, name: 'Céramique', count: 124 },
    { id: 2, name: 'Ébénisterie', count: 86 },
    { id: 3, name: 'Bijouterie', count: 152 },
    { id: 4, name: 'Textile', count: 98 },
    { id: 5, name: 'Verrerie', count: 67 }
  ];
  
  materials = [
    { id: 1, name: 'Bois' },
    { id: 2, name: 'Céramique' },
    { id: 3, name: 'Métal' },
    { id: 4, name: 'Verre' },
    { id: 5, name: 'Textile' },
    { id: 6, name: 'Pierre' }
  ];
  
  products = [
    {
      id: 1,
      name: 'Vase Artisanal',
      artisanName: 'Marie Dubois',
      artisanCertified: true,
      price: 129.99,
      rating: 4.8,
      reviewCount: 24,
      image: '/assets/product1.jpg',
      category: 1,
      material: 2
    },
    // Ajoutez plus de produits ici
  ];
  
  filteredProducts: any[] = [];
  selectedCategories: number[] = [];
  selectedMaterials: number[] = [];
  priceRange = { min: 0, max: 1000, current: 1000 };
  onlyCertified = false;
  sortBy = 'popular';
  viewMode = 'grid';
  currentPage = 1;
  pages = [1, 2, 3, 4, 5];
  
  ngOnInit() {
    this.applyFilters();
  }
  
  toggleCategory(categoryId: number) {
    const index = this.selectedCategories.indexOf(categoryId);
    if (index === -1) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories.splice(index, 1);
    }
    this.applyFilters();
  }
  
  toggleMaterial(materialId: number) {
    const index = this.selectedMaterials.indexOf(materialId);
    if (index === -1) {
      this.selectedMaterials.push(materialId);
    } else {
      this.selectedMaterials.splice(index, 1);
    }
    this.applyFilters();
  }
  
  updatePriceFilter() {
    this.applyFilters();
  }
  
  applyFilters() {
    let filtered = [...this.products];
    
    // Filtrer par catégorie
    if (this.selectedCategories.length > 0) {
      filtered = filtered.filter(product => this.selectedCategories.includes(product.category));
    }
    
    // Filtrer par matériau
    if (this.selectedMaterials.length > 0) {
      filtered = filtered.filter(product => this.selectedMaterials.includes(product.material));
    }
    
    // Filtrer par prix
    filtered = filtered.filter(product => product.price <= this.priceRange.current);
    
    // Filtrer par certification
    if (this.onlyCertified) {
      filtered = filtered.filter(product => product.artisanCertified);
    }
    
    // Trier les résultats
    switch (this.sortBy) {
      case 'recent':
        // Tri par date (à implémenter avec des dates réelles)
        break;
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
      default:
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }
    
    this.filteredProducts = filtered;
  }
  
  resetFilters() {
    this.selectedCategories = [];
    this.selectedMaterials = [];
    this.priceRange.current = this.priceRange.max;
    this.onlyCertified = false;
    this.sortBy = 'popular';
    this.applyFilters();
  }
  
  goToPage(page: number) {
    this.currentPage = page;
    // Implémenter la pagination réelle
  }
}
