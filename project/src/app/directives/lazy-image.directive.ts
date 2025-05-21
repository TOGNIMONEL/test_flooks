import { Directive, ElementRef, HostBinding, Input, OnInit } from '@angular/core';

@Directive({
  selector: 'img[appLazyImage]',
  standalone: true
})
export class LazyImageDirective implements OnInit {
  @HostBinding('attr.src') srcAttr = '';
  @Input() src: string = '';
  @Input() loadingPlaceholder: string = '/assets/placeholder.jpg';
  @Input() errorPlaceholder: string = '/assets/image-error.jpg';

  private observer: IntersectionObserver | undefined;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    // Définir l'image de chargement
    this.srcAttr = this.loadingPlaceholder;

    // Vérifier si IntersectionObserver est supporté par le navigateur
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          // Si l'élément est visible
          if (entry.isIntersecting) {
            // Charger l'image
            this.loadImage();
            // Arrêter d'observer cet élément
            if (this.observer) {
              this.observer.unobserve(this.el.nativeElement);
            }
          }
        });
      }, { threshold: 0.1 }); // Déclencher lorsque 10% de l'image est visible

      this.observer.observe(this.el.nativeElement);
    } else {
      // Fallback pour les navigateurs qui ne supportent pas IntersectionObserver
      this.loadImage();
    }
  }

  private loadImage() {
    // Créer une nouvelle instance d'Image pour précharger
    const img = new Image();
    img.onload = () => {
      this.srcAttr = this.src;
    };
    img.onerror = () => {
      this.srcAttr = this.errorPlaceholder;
    };
    img.src = this.src;
  }

  ngOnDestroy() {
    // Nettoyer l'observer lorsque la directive est détruite
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
