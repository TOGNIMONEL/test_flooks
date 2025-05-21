import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="product-container">
      <div class="product-viewer">
        <canvas #productCanvas></canvas>
        <div class="viewer-controls">
          <button class="btn-icon view360" (click)="toggle360View()">
            <i class="fas fa-sync-alt"></i>
            <span>Vue 360°</span>
          </button>
          <button class="btn-icon zoom" (click)="toggleZoom()">
            <i class="fas fa-search-plus"></i>
            <span>Zoom</span>
          </button>
          <button class="btn-icon ar" (click)="viewInAR()">
            <i class="fas fa-cube"></i>
            <span>Voir en AR</span>
          </button>
        </div>
        <div class="product-thumbnails">
          @for (image of product.images; track image) {
            <div 
              class="thumbnail" 
              [class.active]="currentImage === image"
              (click)="setCurrentImage(image)">
              <img [src]="image" [alt]="product.name">
            </div>
          }
        </div>
      </div>

      <div class="product-info">
        <div class="artisan-badge">
          <img [src]="product.artisanAvatar" [alt]="product.artisanName">
          <span>{{ product.artisanName }}</span>
          @if (product.artisanCertified) {
            <i class="fas fa-certificate"></i>
          }
        </div>
        
        <h1>{{ product.name }}</h1>
        <div class="rating">
          @for (i of [1, 2, 3, 4, 5]; track i) {
            <i class="fas fa-star" [class.active]="i <= product.rating"></i>
          }
          <span class="review-count">({{ product.reviewCount }} avis)</span>
        </div>
        
        <div class="price">{{ product.price | currency:'EUR' }}</div>
        
        <div class="product-options">
          <div class="option-group">
            <label>Matériau</label>
            <div class="options">
              @for (material of product.materials; track material) {
                <button 
                  class="option-btn" 
                  [class.selected]="selectedMaterial === material"
                  (click)="selectMaterial(material)">
                  {{ material }}
                </button>
              }
            </div>
          </div>
          
          <div class="option-group">
            <label>Couleur</label>
            <div class="options">
              @for (color of product.colors; track color) {
                <button 
                  class="color-btn" 
                  [style.background-color]="color"
                  [class.selected]="selectedColor === color"
                  (click)="selectColor(color)">
                </button>
              }
            </div>
          </div>
          
          <div class="option-group">
            <label>Taille</label>
            <div class="options">
              @for (spec of product.specifications; track spec) {
                @if (spec.name === 'Taille') {
                  <button 
                    class="option-btn" 
                    [class.selected]="selectedSize === spec.value"
                    (click)="selectSize(spec.value)">
                    {{ spec.value }}
                  </button>
                }
              }
            </div>
          </div>
        </div>
        
        <div class="product-actions">
          <button class="btn btn-primary btn-lg" (click)="addToCart()">
            <i class="fas fa-shopping-cart"></i>
            Ajouter au panier
          </button>
          <button class="btn btn-outline btn-lg" (click)="openCustomRequestModal()">
            <i class="fas fa-edit"></i>
            Demande personnalisée
          </button>
        </div>
        
        <div class="delivery-info">
          <i class="fas fa-truck"></i>
          <span>Délai de livraison estimé: {{ product.deliveryTime }}</span>
        </div>
      </div>
      
      <div class="product-details">
        <div class="tabs">
          <button 
            class="tab-btn" 
            [class.active]="activeTab === 'details'"
            (click)="setActiveTab('details')">
            Détails
          </button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab === 'process'"
            (click)="setActiveTab('process')">
            Processus de fabrication
          </button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab === 'reviews'"
            (click)="setActiveTab('reviews')">
            Avis ({{ product.reviews.length }})
          </button>
        </div>
        
        <div class="tab-content">
          @if (activeTab === 'details') {
            <div class="details-tab">
              <div class="description">
                <h3>Description</h3>
                <p>{{ product.description }}</p>
              </div>
              
              <div class="specifications">
                <h3>Spécifications</h3>
                <ul>
                  @for (spec of product.specifications; track spec) {
                    <li>
                      <strong>{{ spec.name }}:</strong> {{ spec.value }}
                    </li>
                  }
                </ul>
              </div>
              
              <div class="dimensions">
                <h3>Dimensions</h3>
                <ul>
                  <li><strong>Largeur:</strong> {{ product.dimensions.width }} cm</li>
                  <li><strong>Hauteur:</strong> {{ product.dimensions.height }} cm</li>
                  <li><strong>Profondeur:</strong> {{ product.dimensions.depth }} cm</li>
                </ul>
              </div>
            </div>
          }
          
          @if (activeTab === 'process') {
            <div class="process-tab">
              <h3>Processus de fabrication</h3>
              <div class="process-steps">
                @for (step of product.process; track step) {
                  <div class="process-step">
                    <div class="step-image">
                      <img [src]="step.image" [alt]="step.title">
                    </div>
                    <div class="step-content">
                      <h4>{{ step.title }}</h4>
                      <p>{{ step.description }}</p>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
          
          @if (activeTab === 'reviews') {
            <div class="reviews-tab">
              <h3>Avis clients</h3>
              <div class="reviews-list">
                @for (review of product.reviews; track review) {
                  <div class="review">
                    <div class="review-header">
                      <img [src]="review.user.avatar" [alt]="review.user.name">
                      <div>
                        <h4>{{ review.user.name }}</h4>
                        <span class="review-date">{{ review.date | date }}</span>
                      </div>
                    </div>
                    <p>{{ review.text }}</p>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
    
    <!-- Modal de demande personnalisée -->
    @if (showCustomRequestModal) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Demande personnalisée</h3>
            <button class="close-btn" (click)="closeModal()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <p>Décrivez votre demande personnalisée pour ce produit:</p>
            <textarea 
              [(ngModel)]="customRequest" 
              rows="5" 
              placeholder="Décrivez les personnalisations souhaitées...">
            </textarea>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" (click)="closeModal()">Annuler</button>
            <button class="btn btn-primary" (click)="sendCustomRequest()">Envoyer</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .product-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .product-viewer {
      position: relative;
      margin-bottom: 2rem;
    }
    
    canvas {
      width: 100%;
      height: 400px;
      border-radius: 8px;
      background-color: #f8f8f8;
    }
    
    .viewer-controls {
      position: absolute;
      top: 1rem;
      right: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .btn-icon {
      background: rgba(255, 255, 255, 0.8);
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      transition: all 0.3s ease;
    }
    
    .btn-icon:hover {
      background: var(--primary-color);
    }
    
    .btn-icon span {
      position: absolute;
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      margin-right: 0.5rem;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
      white-space: nowrap;
    }
    
    .btn-icon:hover span {
      opacity: 1;
    }
    
    .product-thumbnails {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
    }
    
    .thumbnail {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.3s ease;
    }
    
    .thumbnail.active {
      border-color: var(--primary-color);
    }
    
    .thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .product-info {
      margin-bottom: 2rem;
    }
    
    .artisan-badge {
      display: inline-flex;
      align-items: center;
      background-color: #f8f8f8;
      padding: 0.5rem 1rem;
      border-radius: 50px;
      margin-bottom: 1rem;
    }
    
    .artisan-badge img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 0.5rem;
    }
    
    .artisan-badge i {
      color: var(--primary-color);
      margin-left: 0.5rem;
    }
    
    h1 {
      margin-bottom: 0.5rem;
    }
    
    .rating {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .rating i {
      color: #ddd;
      margin-right: 2px;
    }
    
    .rating i.active {
      color: var(--primary-color);
    }
    
    .review-count {
      margin-left: 0.5rem;
      color: #777;
    }
    
    .price {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 1.5rem;
    }
    
    .product-options {
      margin-bottom: 1.5rem;
    }
    
    .option-group {
      margin-bottom: 1rem;
    }
    
    .option-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    
    .options {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    
    .option-btn {
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: none;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .option-btn.selected {
      border-color: var(--primary-color);
      background-color: var(--primary-color);
      color: var(--accent-color);
    }
    
    .color-btn {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 2px solid transparent;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .color-btn.selected {
      border-color: var(--accent-color);
      transform: scale(1.2);
    }
    
    .product-actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .delivery-info {
      display: flex;
      align-items: center;
      color: #777;
    }
    
    .delivery-info i {
      margin-right: 0.5rem;
    }
    
    .product-details {
      margin-top: 3rem;
    }
    
    .tabs {
      display: flex;
      border-bottom: 1px solid #ddd;
      margin-bottom: 1.5rem;
    }
    
    .tab-btn {
      padding: 1rem 1.5rem;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    
    .tab-btn.active {
      border-bottom-color: var(--primary-color);
      color: var(--primary-color);
    }
    
    .tab-content {
      min-height: 300px;
    }
    
    .details-tab h3,
    .process-tab h3,
    .reviews-tab h3 {
      margin-bottom: 1rem;
    }
    
    .description p {
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
    
    .specifications ul,
    .dimensions ul {
      list-style: none;
      padding: 0;
    }
    
    .specifications li,
    .dimensions li {
      margin-bottom: 0.5rem;
    }
    
    .process-steps {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    
    .process-step {
      display: flex;
      gap: 1.5rem;
    }
    
    .step-image {
      flex: 0 0 200px;
    }
    
    .step-image img {
      width: 100%;
      height: 150px;
      object-fit: cover;
      border-radius: 8px;
    }
    
    .step-content h4 {
      margin-bottom: 0.5rem;
    }
    
    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .review {
      padding: 1.5rem;
      background-color: #f8f8f8;
      border-radius: 8px;
    }
    
    .review-header {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .review-header img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 1rem;
    }
    
    .review-header h4 {
      margin: 0;
    }
    
    .review-date {
      font-size: 0.8rem;
      color: #777;
    }
    
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .modal {
      background: white;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
      overflow: hidden;
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #ddd;
    }
    
    .modal-header h3 {
      margin: 0;
    }
    
    .close-btn {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
    }
    
    .modal-body {
      padding: 1.5rem;
    }
    
    .modal-body textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      resize: vertical;
    }
    
    .modal-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid #ddd;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }
    
    @media (max-width: 768px) {
      .process-step {
        flex-direction: column;
      }
      
      .step-image {
        flex: auto;
      }
      
      .product-actions {
        flex-direction: column;
      }
    }
  `]
})
export class ProductComponent implements OnInit, AfterViewInit {
  product = {
    name: 'Vase Artisanal',
    description: 'Vase unique fait main en céramique...',
    materials: ['Céramique', 'Porcelaine', 'Grès'],
    colors: ['#A67B5B', '#DCD7D2', '#8B4513'],
    images: ['assets/featured1.jpg', 'assets/featured2.jpg', 'assets/featured3.jpg'],
    artisanAvatar: 'assets/artisan1.jpg',
    artisanName: 'Marie Dubois',
    artisanCertified: true,
    rating: 4.5,
    reviewCount: 100,
    price: 199.99,
    specifications: [
      { name: 'Matériau', value: 'Céramique' },
      { name: 'Couleur', value: '#A67B5B' },
      { name: 'Taille', value: '10 cm' }
    ],
    dimensions: {
      width: 10,
      height: 15,
      depth: 5
    },
    process: [
      { id: 1, title: 'Étape 1', description: 'Description étape 1', image: 'assets/process1.jpg' },
      { id: 2, title: 'Étape 2', description: 'Description étape 2', image: 'assets/process2.jpg' },
      { id: 3, title: 'Étape 3', description: 'Description étape 3', image: 'assets/process3.jpg' }
    ],
    reviews: [
      { user: { avatar: 'assets/testimonial1.jpg', name: 'Sophie Laurent' }, date: new Date(), text: 'Super produit !' },
      { user: { avatar: 'assets/testimonial2.jpg', name: 'Pierre Dumont' }, date: new Date(), text: 'Très bon produit.' }
    ],
    deliveryTime: '1-2 semaines'
  };

  selectedMaterial = 'Céramique';
  selectedColor = '#A67B5B';
  selectedSize = '10 cm';
  currentImage = 'assets/featured1.jpg';
  showCustomRequestModal = false;
  customRequest = '';
  activeTab = 'details';

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private product3D!: THREE.Mesh;
  private controls!: OrbitControls;
  private animating = false;

  @ViewChild('productCanvas') canvas!: ElementRef<HTMLCanvasElement>;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Récupérer l'ID du produit depuis l'URL
    this.route.params.subscribe(params => {
      const productId = params['id'];
      // Ici, vous pourriez charger les données du produit depuis un service
      console.log('Product ID:', productId);
    });
  }

  ngAfterViewInit() {
    this.initThreeJS();
    this.initControls();
    this.animate();
  }

  private initThreeJS() {
    // Initialisation de Three.js
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ 
      canvas: this.canvas.nativeElement,
      alpha: true,
      antialias: true
    });

    // Configuration de base
    this.renderer.setSize(this.canvas.nativeElement.clientWidth, this.canvas.nativeElement.clientHeight);
    this.camera.position.z = 5;
    
    // Création d'un objet 3D simple (à remplacer par le vrai modèle)
    const geometry = new THREE.CylinderGeometry(1, 1, 3, 32);
    const material = new THREE.MeshPhongMaterial({ color: 0xA67B5B });
    this.product3D = new THREE.Mesh(geometry, material);
    this.scene.add(this.product3D);

    // Ajout de lumière
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    this.scene.add(light);

    // Ajout d'une lumière ambiante
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);

    // Gestion du redimensionnement
    window.addEventListener('resize', () => {
      this.renderer.setSize(this.canvas.nativeElement.clientWidth, this.canvas.nativeElement.clientHeight);
      this.camera.aspect = this.canvas.nativeElement.clientWidth / this.canvas.nativeElement.clientHeight;
      this.camera.updateProjectionMatrix();
    });
  }

  private initControls() {
    this.controls = new OrbitControls(this.camera, this.canvas.nativeElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.update();
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    
    if (this.animating) {
      this.product3D.rotation.y += 0.01;
    }
    
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  selectMaterial(material: string) {
    this.selectedMaterial = material;
  }

  selectColor(color: string) {
    this.selectedColor = color;
    // Mettre à jour la couleur du modèle 3D
    if (this.product3D && this.product3D.material) {
      (this.product3D.material as THREE.MeshPhongMaterial).color.setStyle(color);
    }
  }

  selectSize(size: string) {
    this.selectedSize = size;
  }

  setCurrentImage(image: string) {
    this.currentImage = image;
  }

  toggle360View() {
    this.animating = !this.animating;
  }

  toggleZoom() {
    // Implémenter le zoom
    if (this.camera.zoom === 1) {
      this.camera.zoom = 2;
    } else {
      this.camera.zoom = 1;
    }
    this.camera.updateProjectionMatrix();
  }

  viewInAR() {
    // Implémenter la vue AR (nécessite WebXR)
    alert('La fonctionnalité AR sera bientôt disponible !');
  }

  openCustomRequestModal() {
    this.showCustomRequestModal = true;
  }

  closeModal() {
    this.showCustomRequestModal = false;
  }

  sendCustomRequest() {
    // Envoyer la demande personnalisée
    alert(`Demande envoyée : ${this.customRequest}`);
    this.closeModal();
  }

  addToCart() {
    // Ajouter au panier
    alert('Produit ajouté au panier !');
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
