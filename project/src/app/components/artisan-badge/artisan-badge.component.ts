import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

@Component({
  selector: 'app-artisan-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="badge-container" 
      [style.background]="badge.color"
      [title]="badge.description">
      <i class="fas" [class]="badge.icon"></i>
      <span class="badge-name">{{ badge.name }}</span>
    </div>
  `,
  styles: [`
    .badge-container {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      color: white;
      font-size: 0.9rem;
      font-weight: 500;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-right: 0.5rem;
      margin-bottom: 0.5rem;
      cursor: help;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .badge-container:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .badge-container i {
      font-size: 1rem;
    }
  `]
})
export class ArtisanBadgeComponent {
  @Input() badge!: Badge;
}
