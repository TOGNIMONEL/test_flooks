import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryCardComponent } from '../../components/category-card/category-card.component';
import { TestimonialSliderComponent } from '../../components/testimonial-slider/testimonial-slider.component';
import { ArtisanCardComponent } from '../../components/artisan-card/artisan-card.component';
import { OptimizedImageComponent } from '../../components/optimized-image/optimized-image.component';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    CategoryCardComponent, 
    TestimonialSliderComponent,
    ArtisanCardComponent,
    OptimizedImageComponent
  ],
  template: `
    <section class="hero">
      <div class="hero-background">
        <div class="overlay"></div>
        <div class="animated-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
        <div class="particles" #particles></div>
      </div>
      <div class="container hero-content">
        <div class="hero-text">
          <h1 class="animated-title">L'artisanat réinventé</h1>
          <p class="subtitle">Connectez, créez, partagez</p>
          <div class="cta-buttons">
            <button class="btn btn-primary" routerLink="/explore">Explorer</button>
            <button class="btn btn-outline" routerLink="/auth/register">Devenir Artisan</button>
          </div>
        </div>
        <div class="hero-animation">
          <div class="craftsman-animation" #craftsmanAnimation></div>
        </div>
      </div>
      <div class="scroll-indicator">
        <div class="mouse">
          <div class="wheel"></div>
        </div>
        <div class="arrow">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </section>

    <section class="certified-artisans section">
      <div class="container">
        <h2 class="section-title" #artisansTitle>Nos Artisans Certifiés</h2>
        <div class="artisans-grid">
          @for (artisan of artisans; track artisan.id) {
            <app-artisan-card [artisan]="artisan" [attr.data-aos]="'fade-up'" [attr.data-aos-delay]="artisan.id * 100"></app-artisan-card>
          }
        </div>
        <div class="text-center mt-4">
          <button class="btn btn-outline" routerLink="/explore">Voir tous les artisans</button>
        </div>
      </div>
    </section>

    <section class="categories section">
      <div class="container">
        <h2 class="section-title" #categoriesTitle>Catégories d'Artisanat</h2>
        <div class="categories-grid">
          @for (category of categories; track category.id) {
            <app-category-card [category]="category" [attr.data-aos]="'zoom-in'" [attr.data-aos-delay]="category.id * 100"></app-category-card>
          }
        </div>
      </div>
    </section>

    <section class="featured-works section">
      <div class="container">
        <h2 class="section-title">Créations en Vedette</h2>
        <div class="featured-grid">
          @for (work of featuredWorks; track work.id) {
            <div class="featured-item">
              <app-optimized-image 
                [src]="work.image" 
                [alt]="work.title" 
                position="below-fold"
                [usePicture]="true"
                className="featured-background"
              ></app-optimized-image>
              <div class="featured-overlay">
                <h3>{{ work.title }}</h3>
                <p>{{ work.artisan }}</p>
                <button class="btn btn-primary btn-sm" [routerLink]="['/product', work.id]">Découvrir</button>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <section class="testimonials section">
      <div class="container">
        <h2 class="section-title" #testimonialsTitle>Témoignages</h2>
        <app-testimonial-slider [testimonials]="testimonials"></app-testimonial-slider>
      </div>
    </section>

    <section class="join-community section">
      <div class="container">
        <div class="join-content">
          <h2>Rejoignez notre communauté d'artisans passionnés</h2>
          <p>Partagez votre savoir-faire, développez votre clientèle et faites partie d'un réseau d'excellence.</p>
          <button class="btn btn-primary btn-lg" routerLink="/auth/register">Devenir Artisan</button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      height: 100vh;
      display: flex;
      align-items: center;
      position: relative;
      overflow: hidden;
    }

    .hero-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, var(--background-color) 60%, var(--primary-color) 100%);
      opacity: 0.9;
    }

    .animated-shapes {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .shape {
      position: absolute;
      border-radius: 50%;
      opacity: 0.1;
    }

    .shape-1 {
      width: 300px;
      height: 300px;
      background: var(--primary-color);
      top: 10%;
      right: 10%;
      animation: float 8s infinite ease-in-out;
    }

    .shape-2 {
      width: 200px;
      height: 200px;
      background: var(--accent-color);
      bottom: 10%;
      left: 10%;
      animation: float 12s infinite ease-in-out reverse;
    }

    .shape-3 {
      width: 150px;
      height: 150px;
      background: var(--primary-color);
      top: 50%;
      left: 50%;
      animation: float 10s infinite ease-in-out 2s;
    }

    .particles {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .hero-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
      z-index: 1;
    }

    .hero-text h1 {
      font-size: 4rem;
      margin-bottom: 1rem;
      font-weight: 700;
      position: relative;
    }

    .animated-title {
      background: linear-gradient(45deg, var(--accent-color), var(--primary-color));
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      animation: titleAnimation 3s infinite alternate;
    }

    .subtitle {
      font-size: 1.5rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .cta-buttons {
      display: flex;
      gap: 1rem;
    }

    .btn {
      position: relative;
      overflow: hidden;
    }

    .btn::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }

    .btn:hover::after {
      width: 300px;
      height: 300px;
    }

    .craftsman-animation {
      height: 400px;
      background: url('/assets/craftsman.svg') no-repeat center;
      animation: work 3s infinite ease-in-out;
      transform-origin: bottom center;
    }

    .scroll-indicator {
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      opacity: 0.7;
      transition: opacity 0.3s ease;
    }

    .scroll-indicator:hover {
      opacity: 1;
    }

    .mouse {
      width: 30px;
      height: 50px;
      border: 2px solid var(--accent-color);
      border-radius: 20px;
      position: relative;
    }

    .wheel {
      width: 6px;
      height: 6px;
      background: var(--accent-color);
      border-radius: 50%;
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      animation: scroll 1.5s infinite;
    }

    .arrow {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
    }

    .arrow span {
      display: block;
      width: 10px;
      height: 10px;
      border-bottom: 2px solid var(--accent-color);
      border-right: 2px solid var(--accent-color);
      transform: rotate(45deg);
      animation: arrow 1.5s infinite;
    }

    .arrow span:nth-child(2) {
      animation-delay: 0.2s;
    }

    .arrow span:nth-child(3) {
      animation-delay: 0.4s;
    }

    .section-title {
      font-size: 2.5rem;
      text-align: center;
      margin-bottom: 3rem;
      position: relative;
      display: inline-block;
      left: 50%;
      transform: translateX(-50%);
    }

    .section-title::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 100%;
      height: 3px;
      background: var(--primary-color);
      transform: scaleX(0.3);
      transform-origin: center;
      transition: transform 0.3s ease;
    }

    .section-title:hover::after {
      transform: scaleX(1);
    }

    .featured-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(2, 200px);
      gap: 1rem;
      margin-top: 2rem;
    }

    .featured-item {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.3s ease;
    }
    
    .featured-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .featured-item:first-child {
      grid-column: span 2;
      grid-row: span 2;
    }

    .featured-item:hover {
      transform: scale(1.02);
    }

    .featured-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 1rem;
      background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
      color: white;
      transform: translateY(100%);
      transition: transform 0.3s ease;
    }

    .featured-item:hover .featured-overlay {
      transform: translateY(0);
    }

    .featured-overlay h3 {
      margin: 0 0 0.5rem;
      font-size: 1.2rem;
    }

    .featured-overlay p {
      margin: 0 0 1rem;
      font-size: 0.9rem;
      opacity: 0.8;
    }

    .join-community {
      background: linear-gradient(45deg, var(--accent-color), var(--primary-color));
      color: white;
      text-align: center;
    }

    .join-content {
      max-width: 700px;
      margin: 0 auto;
      padding: 3rem 0;
    }

    .join-content h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .join-content p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .text-center {
      text-align: center;
    }

    .mt-4 {
      margin-top: 2rem;
    }

    .btn-lg {
      padding: 1rem 2rem;
      font-size: 1.2rem;
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(20px, -20px); }
    }

    @keyframes work {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-10px) rotate(2deg); }
    }

    @keyframes titleAnimation {
      0% { background-position: 0% 50%; }
      100% { background-position: 100% 50%; }
    }

    @keyframes scroll {
      0% { opacity: 1; transform: translateX(-50%) translateY(0); }
      100% { opacity: 0; transform: translateX(-50%) translateY(20px); }
    }

    @keyframes arrow {
      0% { opacity: 0; transform: rotate(45deg) translate(-5px, -5px); }
      50% { opacity: 1; }
      100% { opacity: 0; transform: rotate(45deg) translate(5px, 5px); }
    }

    @media (max-width: 768px) {
      .hero-content {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .cta-buttons {
        justify-content: center;
      }

      .hero-animation {
        display: none;
      }

      .featured-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 480px) {
      .featured-grid {
        grid-template-columns: 1fr;
      }

      .featured-item:first-child {
        grid-column: auto;
        grid-row: auto;
      }
    }
  `]
})
export class HomeComponent implements AfterViewInit, OnInit {
  @ViewChild('craftsmanAnimation') craftsmanAnimation!: ElementRef;
  @ViewChild('particles') particles!: ElementRef;
  @ViewChild('artisansTitle') artisansTitle!: ElementRef;
  @ViewChild('categoriesTitle') categoriesTitle!: ElementRef;
  @ViewChild('testimonialsTitle') testimonialsTitle!: ElementRef;

  artisans = [
    { 
      id: 1, 
      name: 'Marie Dubois', 
      specialty: 'Céramiste', 
      image: 'assets/artisan1.jpg',
      rating: 4.9,
      certified: true 
    },
    { 
      id: 2, 
      name: 'Jean Martin', 
      specialty: 'Ébéniste', 
      image: 'assets/artisan2.jpg',
      rating: 4.8,
      certified: true 
    },
    { 
      id: 3, 
      name: 'Sophie Laurent', 
      specialty: 'Bijoutière', 
      image: 'assets/artisan3.jpg',
      rating: 4.7,
      certified: true 
    },
    { 
      id: 4, 
      name: 'Thomas Petit', 
      specialty: 'Verrier', 
      image: 'assets/artisan4.jpg',
      rating: 4.9,
      certified: true 
    }
  ];

  categories = [
    { 
      id: 1, 
      name: 'Céramique', 
      icon: 'fas fa-paint-brush', 
      image: 'assets/ceramique.jpg',
      count: 124
    },
    { 
      id: 2, 
      name: 'Ébénisterie', 
      icon: 'fas fa-hammer', 
      image: 'assets/ebenisterie.jpg',
      count: 86
    },
    { 
      id: 3, 
      name: 'Bijouterie', 
      icon: 'fas fa-gem', 
      image: 'assets/bijouterie.jpg',
      count: 152
    },
    { 
      id: 4, 
      name: 'Textile', 
      icon: 'fas fa-tshirt', 
      image: 'assets/textile.jpg',
      count: 98
    },
    { 
      id: 5, 
      name: 'Verrerie', 
      icon: 'fas fa-wine-glass-alt', 
      image: 'assets/verrerie.jpg',
      count: 67
    }
  ];

  testimonials = [
    {
      id: 1,
      name: 'Sophie Laurent',
      role: 'Cliente',
      text: 'Une expérience unique avec des artisans passionnés. La qualité des produits est exceptionnelle et le service client est impeccable.',
      avatar: 'assets/testimonial1.jpg',
      rating: 5
    },
    {
      id: 2,
      name: 'Pierre Dumont',
      role: 'Client',
      text: 'J\'ai commandé un meuble sur mesure et le résultat dépasse mes attentes. Le suivi de commande en temps réel est vraiment pratique.',
      avatar: 'assets/testimonial2.jpg',
      rating: 4
    },
    {
      id: 3,
      name: 'Émilie Rousseau',
      role: 'Artisane',
      text: 'Cette plateforme m\'a permis de développer ma clientèle et de me concentrer sur ma passion. Les outils mis à disposition sont parfaits.',
      avatar: 'assets/testimonial3.jpg',
      rating: 5
    }
  ];

  featuredWorks = [
    {
      id: 1,
      title: 'Vase Collection Été',
      artisan: 'Marie Dubois',
      image: 'assets/featured1.jpg'
    },
    {
      id: 2,
      title: 'Table Basse Scandinave',
      artisan: 'Jean Martin',
      image: 'assets/featured2.jpg'
    },
    {
      id: 3,
      title: 'Collier Perles Naturelles',
      artisan: 'Sophie Laurent',
      image: 'assets/featured3.jpg'
    },
    {
      id: 4,
      title: 'Lampe Art Déco',
      artisan: 'Thomas Petit',
      image: 'assets/featured4.jpg'
    },
    {
      id: 5,
      title: 'Coussin Brodé Main',
      artisan: 'Lucie Moreau',
      image: 'assets/featured5.jpg'
    }
  ];

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  constructor() {
    // Enregistrer le plugin ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
  }

  ngOnInit() {
    // Initialisation des animations GSAP
    this.initGsapAnimations();
  }

  ngAfterViewInit() {
    // Animation pour l'artisan avec GSAP
    this.animateCraftsman();
    
    // Initialisation des particules avec Three.js
    this.initParticles();
    
    // Observer pour les animations au scroll
    this.setupScrollAnimations();
  }

  initGsapAnimations() {
    // Animation du titre avec GSAP
    gsap.from('.animated-title', {
      duration: 1.5,
      opacity: 0,
      y: 50,
      ease: 'power3.out'
    });

    gsap.from('.subtitle', {
      duration: 1.5,
      opacity: 0,
      y: 30,
      ease: 'power3.out',
      delay: 0.3
    });

    gsap.from('.cta-buttons', {
      duration: 1.5,
      opacity: 0,
      y: 20,
      ease: 'power3.out',
      delay: 0.6
    });
  }

  animateCraftsman() {
    if (this.craftsmanAnimation) {
      gsap.to(this.craftsmanAnimation.nativeElement, {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
    }
  }

  initParticles() {
    if (!this.particles) return;

    // Création de la scène Three.js
    this.scene = new THREE.Scene();
    
    // Création de la caméra
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;
    
    // Création du renderer
    this.renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.particles.nativeElement.appendChild(this.renderer.domElement);
    
    // Ajout des particules
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xffffff,
      transparent: true,
      opacity: 0.5
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    this.scene.add(particlesMesh);
    
    // Animation des particules
    const animate = () => {
      requestAnimationFrame(animate);
      
      particlesMesh.rotation.x += 0.0005;
      particlesMesh.rotation.y += 0.0005;
      
      this.renderer.render(this.scene, this.camera);
    };
    
    animate();
    
    // Gestion du redimensionnement
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  setupScrollAnimations() {
    // Configuration des animations au scroll avec GSAP ScrollTrigger
    if (this.artisansTitle) {
      gsap.from(this.artisansTitle.nativeElement, {
        scrollTrigger: {
          trigger: this.artisansTitle.nativeElement,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 50,
        duration: 1
      });
    }

    if (this.categoriesTitle) {
      gsap.from(this.categoriesTitle.nativeElement, {
        scrollTrigger: {
          trigger: this.categoriesTitle.nativeElement,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 50,
        duration: 1
      });
    }

    if (this.testimonialsTitle) {
      gsap.from(this.testimonialsTitle.nativeElement, {
        scrollTrigger: {
          trigger: this.testimonialsTitle.nativeElement,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 50,
        duration: 1
      });
    }

    // Animation des grilles
    gsap.utils.toArray('.artisans-grid app-artisan-card').forEach((card: any, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: i * 0.1
      });
    });

    gsap.utils.toArray('.categories-grid app-category-card').forEach((card: any, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        delay: i * 0.1
      });
    });

    gsap.utils.toArray('.featured-item').forEach((item: any, i) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: i * 0.1
      });
    });
  }
}