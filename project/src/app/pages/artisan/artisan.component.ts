import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-artisan',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="artisan-profile">
      <div class="profile-header">
        <div class="container">
          <div class="profile-info">
            <img [src]="artisan.avatar" [alt]="artisan.name" class="avatar">
            <div class="info">
              <h1>{{ artisan.name }}</h1>
              <p class="specialty">{{ artisan.specialty }}</p>
              <div class="badge">
                <i class="fas fa-certificate"></i> Artisan Certifié
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container content">
        <div class="bio">
          <h2>À propos</h2>
          <p>{{ artisan.bio }}</p>
        </div>

        <div class="gallery">
          <h2>Mes Créations</h2>
          <div class="works-grid">
            @for (work of artisan.works; track work.id) {
              <div class="work-card">
                <img [src]="work.image" [alt]="work.title">
                <div class="work-info">
                  <h3>{{ work.title }}</h3>
                  <p>{{ work.description }}</p>
                </div>
              </div>
            }
          </div>
        </div>

        <div class="contact">
          <h2>Contact</h2>
          <div class="messaging">
            <div class="chat-window">
              @for (message of messages; track message.id) {
                <div class="message" [class.sent]="message.sent">
                  <img [src]="message.avatar" [alt]="message.name" class="message-avatar">
                  <div class="message-content">
                    <p>{{ message.text }}</p>
                    <span class="time">{{ message.time }}</span>
                  </div>
                </div>
              }
            </div>
            <div class="message-input">
              <input 
                type="text" 
                [(ngModel)]="newMessage" 
                placeholder="Écrivez votre message..."
              >
              <button class="btn btn-primary" (click)="sendMessage()">
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .artisan-profile {
      margin-top: 80px;
    }

    .profile-header {
      background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
      padding: 4rem 0;
      color: white;
    }

    .profile-info {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .avatar {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      border: 4px solid white;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(255,255,255,0.2);
      border-radius: 20px;
      margin-top: 1rem;
    }

    .content {
      padding: 2rem;
      display: grid;
      gap: 3rem;
    }

    .works-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }

    .work-card {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .work-card img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .work-info {
      padding: 1rem;
      background: white;
    }

    .messaging {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .chat-window {
      height: 400px;
      overflow-y: auto;
      padding: 1rem;
    }

    .message {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .message.sent {
      flex-direction: row-reverse;
    }

    .message-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .message-content {
      background: #f5f5f5;
      padding: 1rem;
      border-radius: 8px;
      max-width: 70%;
    }

    .sent .message-content {
      background: var(--primary-color);
      color: var(--accent-color);
    }

    .message-input {
      display: flex;
      padding: 1rem;
      border-top: 1px solid #eee;
    }

    .message-input input {
      flex: 1;
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      border-radius: 20px;
      margin-right: 1rem;
    }
  `]
})
export class ArtisanComponent {
  artisan = {
    name: 'Marie Dubois',
    specialty: 'Céramiste',
    avatar: '/assets/artisan1.jpg',
    bio: 'Artisan céramiste depuis 15 ans...',
    works: [
      {
        id: 1,
        title: 'Vase Collection Été',
        description: 'Vase en céramique fait main',
        image: '/assets/work1.jpg'
      },
      // ... autres œuvres
    ]
  };

  messages = [
    {
      id: 1,
      name: 'Client',
      text: 'Bonjour, j\'aimerais en savoir plus sur vos créations',
      time: '10:30',
      avatar: '/assets/client1.jpg',
      sent: false
    },
    // ... autres messages
  ];

  newMessage = '';

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({
        id: this.messages.length + 1,
        name: 'Vous',
        text: this.newMessage,
        time: new Date().toLocaleTimeString(),
        avatar: '/assets/user.jpg',
        sent: true
      });
      this.newMessage = '';
    }
  }
}