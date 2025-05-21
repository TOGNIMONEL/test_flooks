import { Injectable } from '@angular/core';

export interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
}

@Injectable({
  providedIn: 'root'
})
export class ImageOptimizationService {
  private readonly defaultOptions: ImageOptions = {
    width: 800,
    quality: 85,
    format: 'webp'
  };

  constructor() {}

  /**
   * Optimise une URL d'image en ajoutant des paramètres pour le redimensionnement et l'optimisation
   * Note: Cette méthode suppose que vous avez un service de redimensionnement d'images côté serveur
   * comme Cloudinary, Imgix, ou un service personnalisé.
   */
  optimizeImageUrl(imageUrl: string, options?: ImageOptions): string {
    // Si l'URL est vide ou null, retourner une image par défaut
    if (!imageUrl) {
      return '/assets/placeholder.jpg';
    }

    // Si c'est déjà une URL optimisée ou une image locale, la retourner telle quelle
    if (imageUrl.startsWith('/assets/') || imageUrl.includes('placeholder') || imageUrl.includes('?')) {
      return imageUrl;
    }

    // Fusionner les options par défaut avec les options fournies
    const opts = { ...this.defaultOptions, ...options };

    // Simuler un service d'optimisation d'images
    // Dans une application réelle, vous utiliseriez un service comme Cloudinary ou Imgix
    // ou votre propre API d'optimisation d'images
    if (imageUrl.startsWith('http')) {
      // Pour les images externes, on peut utiliser un proxy d'optimisation
      // Exemple avec un service fictif
      return `https://image-optimizer.example.com/?url=${encodeURIComponent(imageUrl)}&w=${opts.width}&q=${opts.quality}&fmt=${opts.format}`;
    } else {
      // Pour les images locales, on peut ajouter des paramètres à l'URL
      // Cela suppose que vous avez configuré un middleware côté serveur pour traiter ces paramètres
      return `${imageUrl}?w=${opts.width}&q=${opts.quality}&fmt=${opts.format}`;
    }
  }

  /**
   * Génère un ensemble de sources pour une balise picture avec différents formats et tailles
   */
  generateResponsiveSources(imageUrl: string, sizes: number[] = [320, 640, 960, 1280]): { srcset: string, sizes: string }[] {
    if (!imageUrl) {
      return [];
    }

    const formats: ('webp' | 'avif' | 'jpeg')[] = ['webp', 'avif', 'jpeg'];
    
    return formats.map(format => {
      const srcset = sizes.map(size => {
        const optimizedUrl = this.optimizeImageUrl(imageUrl, { width: size, format });
        return `${optimizedUrl} ${size}w`;
      }).join(', ');

      return {
        srcset,
        sizes: sizes.map((size, index) => {
          if (index === sizes.length - 1) {
            return `(min-width: ${size}px) ${size}px, 100vw`;
          }
          return `(max-width: ${size}px) ${size}px`;
        }).join(', ')
      };
    });
  }

  /**
   * Détermine si une image doit être chargée en priorité (au-dessus de la ligne de flottaison)
   */
  shouldLoadWithPriority(imagePosition: 'hero' | 'above-fold' | 'below-fold' | 'thumbnail'): boolean {
    return ['hero', 'above-fold', 'thumbnail'].includes(imagePosition);
  }
}
