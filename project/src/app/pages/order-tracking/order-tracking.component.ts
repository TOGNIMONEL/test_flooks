import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="order-tracking">
      <h1>Suivi de Commande</h1>
      <div class="tracking-info">
        <h2>Commande #{{ order.id }}</h2>
        <p>Statut: <span [class]="order.statusClass">{{ order.status }}</span></p>
        <p>Commandé le: {{ order.date | date:'dd/MM/yyyy' }}</p>
      </div>
      <div class="timeline">
        <h3>Étapes de fabrication</h3>
        <ul>
          @for (step of order.timeline; track step.id) {
            <li [class.completed]="step.completed">
              <span>{{ step.title }}</span>
              <span class="step-date">{{ step.date | date:'dd/MM/yyyy' }}</span>
            </li>
          }
        </ul>
      </div>
      <div class="chat-container">
        <h3>Discuter avec l'artisan</h3>
        <div class="chat-messages">
          @for (message of order.messages; track message.id) {
            <div class="chat-message" [class.outgoing]="message.sender === 'client'">
              <div class="message-bubble">
                <p>{{ message.text }}</p>
                <span class="message-time">{{ message.time }}</span>
              </div>
            </div>
          }
        </div>
        <div class="chat-input">
          <input 
            type="text" 
            placeholder="Écrivez votre message..." 
            [(ngModel)]="newMessage"
            (keyup.enter)="sendMessage()">
          <button class="btn-send" (click)="sendMessage()">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .order-tracking {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      text-align: center;
      margin-bottom: 2rem;
    }

    .tracking-info {
      background-color: var(--background-alt);
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .tracking-info h2 {
      margin-top: 0;
    }

    .tracking-info p {
      margin: 0.5rem 0;
    }

    .timeline {
      margin-bottom: 2rem;
    }

    .timeline ul {
      list-style: none;
      padding: 0;
      position: relative;
    }

    .timeline ul::before {
      content: '';
      position: absolute;
      top: 0;
      left: 10px;
      width: 2px;
      height: 100%;
      background-color: var(--border-color);
    }

    .timeline li {
      position: relative;
      padding-left: 30px;
      margin-bottom: 1.5rem;
      opacity: 0.6;
    }

    .timeline li::before {
      content: '';
      position: absolute;
      left: 0;
      top: 5px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: var(--background-color);
      border: 2px solid var(--border-color);
    }

    .timeline li.completed {
      opacity: 1;
    }

    .timeline li.completed::before {
      background-color: var(--primary-color);
      border-color: var(--primary-color);
    }

    .step-date {
      display: block;
      font-size: 0.9rem;
      color: var(--text-light);
      margin-top: 0.25rem;
    }

    .chat-container {
      background-color: var(--background-alt);
      border-radius: 8px;
      overflow: hidden;
    }

    .chat-messages {
      padding: 1.5rem;
      max-height: 400px;
      overflow-y: auto;
    }

    .chat-message {
      display: flex;
      margin-bottom: 1rem;
    }

    .chat-message.outgoing {
      justify-content: flex-end;
    }

    .message-bubble {
      max-width: 70%;
      padding: 1rem;
      border-radius: 8px;
      background-color: var(--background-color);
      box-shadow: var(--shadow);
    }

    .chat-message.outgoing .message-bubble {
      background-color: var(--primary-color);
      color: var(--accent-color);
    }

    .message-bubble p {
      margin: 0 0 0.5rem;
    }

    .message-time {
      display: block;
      font-size: 0.8rem;
      text-align: right;
      opacity: 0.7;
    }

    .chat-input {
      display: flex;
      padding: 1rem;
      border-top: 1px solid var(--border-color);
    }

    .chat-input input {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      margin-right: 0.5rem;
    }

    .btn-send {
      background-color: var(--primary-color);
      color: var(--accent-color);
      border: none;
      border-radius: 4px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: var(--transition);
    }

    .btn-send:hover {
      background-color: var(--primary-dark);
    }
  `]
})
export class OrderTrackingComponent implements OnInit {
  order = {
    id: 'ORD-12345',
    status: 'En cours de fabrication',
    statusClass: 'status-in-progress',
    date: new Date('2023-03-15'),
    timeline: [
      {
        id: 1,
        title: 'Commande reçue',
        date: new Date('2023-03-15'),
        completed: true
      },
      {
        id: 2,
        title: 'Matériaux préparés',
        date: new Date('2023-03-18'),
        completed: true
      },
      {
        id: 3,
        title: 'En cours de fabrication',
        date: new Date('2023-03-20'),
        completed: true
      },
      {
        id: 4,
        title: 'Contrôle qualité',
        date: null,
        completed: false
      },
      {
        id: 5,
        title: 'Expédition',
        date: null,
        completed: false
      }
    ],
    messages: [
      {
        id: 1,
        sender: 'artisan',
        text: 'Bonjour ! Je viens de commencer la fabrication de votre commande.',
        time: '15/03/2023 14:30'
      },
      {
        id: 2,
        sender: 'client',
        text: 'Super ! Avez-vous besoin d\'informations supplémentaires ?',
        time: '15/03/2023 15:45'
      },
      {
        id: 3,
        sender: 'artisan',
        text: 'Non, tout est clair. Je vous tiendrai informé de l\'avancement.',
        time: '15/03/2023 16:10'
      }
    ]
  };

  newMessage = '';

  ngOnInit(): void {
    // Initialisation du composant
    this.loadOrderData();
  }

  loadOrderData(): void {
    // Ici, on pourrait charger les données de commande depuis un service
    console.log('Chargement des données de commande');
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const newMsg = {
      id: this.order.messages.length + 1,
      sender: 'client',
      text: this.newMessage,
      time: new Date().toLocaleString('fr-FR', { 
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    this.order.messages.push(newMsg);
    this.newMessage = '';
  }
}
