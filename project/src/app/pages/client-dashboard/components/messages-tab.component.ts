import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-messages-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="messages-tab">
      <h1>Messagerie</h1>
      
      <div class="messages-container">
        <div class="conversations-list">
          <div class="search-box">
            <input type="text" placeholder="Rechercher une conversation..." [(ngModel)]="searchTerm">
          </div>
          
          <div class="conversations">
            <div 
              *ngFor="let conversation of filteredConversations" 
              class="conversation-item"
              [class.active]="selectedConversation?.id === conversation.id"
              (click)="selectConversation(conversation)">
              <img [src]="conversation.avatar" [alt]="conversation.name" class="avatar">
              <div class="conversation-info">
                <h3>{{ conversation.name }}</h3>
                <p class="last-message">{{ conversation.lastMessage }}</p>
              </div>
              <div class="conversation-meta">
                <span class="time">{{ conversation.time }}</span>
                <span *ngIf="conversation.unread" class="unread-badge">{{ conversation.unread }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="chat-area">
          <div *ngIf="selectedConversation; else noConversation" class="chat-container">
            <div class="chat-header">
              <img [src]="selectedConversation.avatar" [alt]="selectedConversation.name" class="avatar">
              <div class="chat-header-info">
                <h3>{{ selectedConversation.name }}</h3>
                <p>{{ selectedConversation.status }}</p>
              </div>
            </div>
            
            <div class="messages-list">
              <div 
                *ngFor="let message of selectedConversation.messages" 
                class="message"
                [class.outgoing]="message.sender === 'me'"
                [class.incoming]="message.sender !== 'me'">
                <div class="message-content">
                  <p>{{ message.text }}</p>
                  <span class="message-time">{{ message.time }}</span>
                </div>
              </div>
            </div>
            
            <div class="message-input">
              <input 
                type="text" 
                placeholder="Écrivez votre message..." 
                [(ngModel)]="newMessage"
                (keyup.enter)="sendMessage()">
              <button class="send-btn" (click)="sendMessage()">
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
          
          <ng-template #noConversation>
            <div class="no-conversation">
              <i class="fas fa-comments"></i>
              <h3>Sélectionnez une conversation</h3>
              <p>Choisissez une conversation dans la liste pour commencer à discuter</p>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .messages-tab {
      padding: 1rem;
      height: calc(100vh - 200px);
      min-height: 500px;
    }
    
    h1 {
      margin-bottom: 2rem;
    }
    
    .messages-container {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 1rem;
      height: calc(100% - 80px);
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: var(--shadow);
    }
    
    .conversations-list {
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
    }
    
    .search-box {
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
    }
    
    .search-box input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
    }
    
    .conversations {
      flex: 1;
      overflow-y: auto;
    }
    
    .conversation-item {
      display: flex;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
      cursor: pointer;
      transition: background 0.3s ease;
    }
    
    .conversation-item:hover {
      background: var(--background-alt);
    }
    
    .conversation-item.active {
      background: var(--background-alt);
    }
    
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 1rem;
    }
    
    .conversation-info {
      flex: 1;
      min-width: 0;
    }
    
    .conversation-info h3 {
      margin: 0 0 0.25rem;
      font-size: 1rem;
    }
    
    .last-message {
      margin: 0;
      font-size: 0.9rem;
      color: var(--text-light);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .conversation-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    
    .time {
      font-size: 0.8rem;
      color: var(--text-light);
      margin-bottom: 0.25rem;
    }
    
    .unread-badge {
      background: var(--primary-color);
      color: white;
      font-size: 0.8rem;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .chat-area {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    
    .chat-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    
    .chat-header {
      display: flex;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
    }
    
    .chat-header-info h3 {
      margin: 0 0 0.25rem;
    }
    
    .chat-header-info p {
      margin: 0;
      font-size: 0.9rem;
      color: var(--text-light);
    }
    
    .messages-list {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .message {
      display: flex;
      max-width: 70%;
    }
    
    .message.outgoing {
      align-self: flex-end;
    }
    
    .message.incoming {
      align-self: flex-start;
    }
    
    .message-content {
      padding: 0.75rem 1rem;
      border-radius: 18px;
      position: relative;
    }
    
    .message.outgoing .message-content {
      background: var(--primary-color);
      color: white;
      border-bottom-right-radius: 4px;
    }
    
    .message.incoming .message-content {
      background: var(--background-alt);
      border-bottom-left-radius: 4px;
    }
    
    .message-content p {
      margin: 0 0 0.5rem;
    }
    
    .message-time {
      font-size: 0.8rem;
      opacity: 0.8;
      display: block;
      text-align: right;
    }
    
    .message-input {
      display: flex;
      padding: 1rem;
      border-top: 1px solid var(--border-color);
    }
    
    .message-input input {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      margin-right: 0.5rem;
    }
    
    .send-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--primary-color);
      color: white;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    
    .no-conversation {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      text-align: center;
    }
    
    .no-conversation i {
      font-size: 3rem;
      color: var(--text-light);
      margin-bottom: 1rem;
    }
    
    .no-conversation h3 {
      margin: 0 0 0.5rem;
    }
    
    .no-conversation p {
      color: var(--text-light);
    }
    
    @media (max-width: 768px) {
      .messages-container {
        grid-template-columns: 1fr;
      }
      
      .conversations-list {
        display: none;
      }
    }
  `]
})
export class MessagesTabComponent {
  @Input() conversations: any[] = [];
  selectedConversation: any = null;
  searchTerm = '';
  newMessage = '';
  
  get filteredConversations(): any[] {
    if (!this.searchTerm) {
      return this.conversations;
    }
    
    const term = this.searchTerm.toLowerCase();
    return this.conversations.filter(conv => 
      conv.name.toLowerCase().includes(term) || 
      conv.lastMessage.toLowerCase().includes(term)
    );
  }
  
  selectConversation(conversation: any): void {
    this.selectedConversation = conversation;
    // Marquer comme lu
    if (conversation.unread) {
      conversation.unread = 0;
    }
  }
  
  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedConversation) {
      return;
    }
    
    this.selectedConversation.messages.push({
      text: this.newMessage,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    
    this.selectedConversation.lastMessage = this.newMessage;
    this.selectedConversation.time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    this.newMessage = '';
    
    // Simuler une réponse
    setTimeout(() => {
      this.selectedConversation.messages.push({
        text: 'Merci pour votre message. Je vous réponds dès que possible.',
        sender: this.selectedConversation.name,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }, 1000);
  }
}
