import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonial-slider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="testimonials-container">
      <div class="testimonials-slider" #slider>
        @for (testimonial of testimonials; track testimonial.id) {
          <div class="testimonial-card" [class.active]="currentIndex === testimonial.id - 1">
            <div class="card-front">
              <div class="avatar-container">
                <img [src]="testimonial.avatar" [alt]="testimonial.name" class="avatar">
              </div>
              <div class="testimonial-content">
                <p class="quote">"{{ testimonial.text }}"</p>
                <div class="rating">
                  @for (i of [1, 2, 3, 4, 5]; track i) {
                    <i class="fas fa-star" [class.active]="i <= testimonial.rating"></i>
                  }
                </div>
                <h4>{{ testimonial.name }}</h4>
                <span class="role">{{ testimonial.role }}</span>
              </div>
            </div>
          </div>
        }
      </div>
      
      <div class="slider-controls">
        <button class="control-btn prev" (click)="prevSlide()">
          <i class="fas fa-chevron-left"></i>
        </button>
        <div class="slider-dots">
          @for (testimonial of testimonials; track testimonial.id) {
            <span 
              class="dot" 
              [class.active]="currentIndex === testimonial.id - 1"
              (click)="goToSlide(testimonial.id - 1)">
            </span>
          }
        </div>
        <button class="control-btn next" (click)="nextSlide()">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .testimonials-container {
      position: relative;
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem 0;
    }

    .testimonials-slider {
      position: relative;
      height: 300px;
      perspective: 1000px;
    }

    .testimonial-card {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
      transform: translateX(100px) scale(0.8);
      transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
      pointer-events: none;
    }

    .testimonial-card.active {
      opacity: 1;
      transform: translateX(0) scale(1);
      pointer-events: auto;
    }

    .card-front {
      position: relative;
      width: 100%;
      height: 100%;
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .avatar-container {
      flex-shrink: 0;
    }

    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid var(--primary-color);
    }

    .testimonial-content {
      flex: 1;
    }

    .quote {
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 1rem;
      font-style: italic;
      color: #555;
    }

    .rating {
      margin-bottom: 1rem;
    }

    .rating .fa-star {
      color: #ddd;
      margin-right: 2px;
    }

    .rating .fa-star.active {
      color: var(--primary-color);
    }

    h4 {
      margin: 0 0 0.25rem;
      font-size: 1.2rem;
    }

    .role {
      color: #777;
      font-size: 0.9rem;
    }

    .slider-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 2rem;
    }

    .control-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--accent-color);
      cursor: pointer;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.3s ease;
    }

    .control-btn:hover {
      background: var(--primary-color);
      color: var(--accent-color);
    }

    .slider-dots {
      display: flex;
      gap: 0.5rem;
      margin: 0 1rem;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #ddd;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .dot.active {
      background: var(--primary-color);
      transform: scale(1.3);
    }

    @media (max-width: 768px) {
      .card-front {
        flex-direction: column;
        text-align: center;
        padding: 1.5rem;
      }

      .avatar {
        width: 80px;
        height: 80px;
        margin-bottom: 1rem;
      }

      .testimonials-slider {
        height: 400px;
      }
    }
  `]
})
export class TestimonialSliderComponent implements AfterViewInit {
  @Input() testimonials: any[] = [];
  @ViewChild('slider') slider!: ElementRef;
  
  currentIndex = 0;
  interval: any;
  
  ngAfterViewInit() {
    this.startAutoSlide();
  }
  
  startAutoSlide() {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }
  
  stopAutoSlide() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
  
  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }
  
  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
  }
  
  goToSlide(index: number) {
    this.currentIndex = index;
  }
}
