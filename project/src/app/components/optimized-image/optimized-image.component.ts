import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyImageDirective } from '../../directives/lazy-image.directive';
import { ImageOptimizationService, ImageOptions } from '../../services/image-optimization.service';

@Component({
  selector: 'app-optimized-image',
  standalone: true,
  imports: [CommonModule, LazyImageDirective],
  template: `
    <ng-container *ngIf="usePicture; else simpleImage">
      <picture>
        <ng-container *ngFor="let source of sources">
          <source [srcset]="source.srcset" [sizes]="source.sizes" [type]="source.type">
        </ng-container>
        <img
          appLazyImage
          [src]="optimizedSrc"
          [alt]="alt"
          [width]="width"
          [height]="height"
          [class]="className"
          [style]="style"
          [loadingPlaceholder]="loadingPlaceholder"
          [errorPlaceholder]="errorPlaceholder"
          [loading]="priority ? 'eager' : 'lazy'"
        />
      </picture>
    </ng-container>
    
    <ng-template #simpleImage>
      <img
        appLazyImage
        [src]="optimizedSrc"
        [alt]="alt"
        [width]="width"
        [height]="height"
        [class]="className"
        [style]="style"
        [loadingPlaceholder]="loadingPlaceholder"
        [errorPlaceholder]="errorPlaceholder"
        [loading]="priority ? 'eager' : 'lazy'"
      />
    </ng-template>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    img {
      max-width: 100%;
      height: auto;
      transition: opacity 0.3s ease;
    }
  `]
})
export class OptimizedImageComponent implements OnInit {
  @Input() src: string = '';
  @Input() alt: string = '';
  @Input() width?: number;
  @Input() height?: number;
  @Input() className: string = '';
  @Input() style: string = '';
  @Input() loadingPlaceholder: string = '/assets/placeholder.jpg';
  @Input() errorPlaceholder: string = '/assets/image-error.jpg';
  @Input() position: 'hero' | 'above-fold' | 'below-fold' | 'thumbnail' = 'below-fold';
  @Input() usePicture: boolean = true;
  @Input() options?: ImageOptions;
  
  optimizedSrc: string = '';
  priority: boolean = false;
  sources: { srcset: string, sizes: string, type: string }[] = [];

  constructor(private imageService: ImageOptimizationService) {}

  ngOnInit(): void {
    // Déterminer si l'image doit être chargée en priorité
    this.priority = this.imageService.shouldLoadWithPriority(this.position);
    
    // Optimiser l'URL de l'image
    this.optimizedSrc = this.imageService.optimizeImageUrl(this.src, this.options);
    
    // Si on utilise la balise picture, générer les sources responsives
    if (this.usePicture) {
      const responsiveSources = this.imageService.generateResponsiveSources(this.src);
      
      this.sources = [
        { 
          srcset: responsiveSources[0].srcset, 
          sizes: responsiveSources[0].sizes, 
          type: 'image/webp' 
        },
        { 
          srcset: responsiveSources[1].srcset, 
          sizes: responsiveSources[1].sizes, 
          type: 'image/avif' 
        },
        { 
          srcset: responsiveSources[2].srcset, 
          sizes: responsiveSources[2].sizes, 
          type: 'image/jpeg' 
        }
      ];
    }
  }
}
