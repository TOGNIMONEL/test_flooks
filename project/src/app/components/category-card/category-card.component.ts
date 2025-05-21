import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OptimizedImageComponent } from '../optimized-image/optimized-image.component';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [CommonModule, RouterLink, OptimizedImageComponent],
  template: `
    <div 
      class="category-card" 
      [routerLink]="['/category', category.id]"
      (mouseenter)="isHovered = true"
      (mouseleave)="isHovered = false">
      <div class="card-content">
        <i [class]="category.icon"></i>
        <h3>{{ category.name }}</h3>
        <span class="count">{{ category.count }} créations</span>
      </div>
      <div class="card-background">
        <app-optimized-image 
          [src]="category.image" 
          [alt]="category.name"
          position="below-fold"
          [usePicture]="true"
        ></app-optimized-image>
        <div class="overlay" [class.active]="isHovered"></div>
      </div>
    </div>
  `,
  styles: [`
    .category-card {
      position: relative;
      height: 250px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
      transition: all 0.4s ease;
      cursor: pointer;
    }

    .category-card:hover {
      transform: translateY(-5px) scale(1.02);
      box-shadow: 0 15px 30px rgba(0,0,0,0.2);
    }

    .card-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }

    .card-background img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .category-card:hover .card-background img {
      transform: scale(1.1);
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%);
      transition: background 0.3s ease;
    }

    .overlay.active {
      background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%);
    }

    .card-content {
      position: relative;
      z-index: 2;
      padding: 1.5rem;
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
    }

    .card-content i {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: var(--primary-color);
      transition: transform 0.3s ease;
    }

    .category-card:hover .card-content i {
      transform: scale(1.2);
    }

    .card-content h3 {
      margin: 0 0 0.5rem;
      font-size: 1.5rem;
      font-weight: 600;
      text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
    }

    .count {
      font-size: 0.9rem;
      opacity: 0.8;
    }
  `]
})
export class CategoryCardComponent {
  @Input() category: any;
  isHovered = false;
}
