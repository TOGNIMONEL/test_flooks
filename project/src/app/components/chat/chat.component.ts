import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chat-container">
      <div class="chat-messages">
        @for (message of messages; track message.id) {
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
  `,
  styles: [`
    .chat-container {
      background: white;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .chat-messages {
      max-height: 300px;
      overflow-y: auto;
      margin-bottom: 1rem;
    }

    .chat-message {
      display: flex;
      margin-bottom: 1rem;
    }

    .message-bubble {
      background: #f5f5f5;
      padding: 0.75rem;
      border-radius: 8px;
      max-width: 70%;
    }

    .chat-input {
      display: flex;
      gap: 0.5rem;
    }

    .chat-input input {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 20px;
    }
  `]
})
export class ChatComponent {
  @Input() messages: any[] = [];
  newMessage = '';

  sendMessage() {
    if (this.newMessage.trim()) {
      // Logique pour envoyer le message
      this.messages.push({
        id: this.messages.length + 1,
        sender: 'client',
        text: this.newMessage,
        time: new Date().toLocaleTimeString()
      });
      this.newMessage = '';
    }
  }
}
