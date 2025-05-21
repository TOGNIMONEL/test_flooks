import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  receiverId: number;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  id: number;
  participants: {
    id: number;
    name: string;
    avatar: string;
  }[];
  lastMessage?: {
    text: string;
    timestamp: Date;
    read: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private currentUserId = 999; // ID de l'utilisateur connecté (simulé)
  
  private conversations: Conversation[] = [
    {
      id: 1,
      participants: [
        { id: 999, name: 'Vous', avatar: '/assets/avatar.jpg' },
        { id: 1, name: 'Marie Dubois', avatar: '/assets/artisan1.jpg' }
      ],
      lastMessage: {
        text: 'Oui, elle est disponible ! Je peux vous proposer une personnalisation si vous le souhaitez.',
        timestamp: new Date('2024-04-02T10:35:00'),
        read: true
      }
    }
  ];
  
  private messages: Message[] = [
    {
      id: 1,
      conversationId: 1,
      senderId: 1,
      receiverId: 999,
      senderName: 'Marie Dubois',
      senderAvatar: '/assets/artisan1.jpg',
      text: 'Bonjour ! Comment puis-je vous aider ?',
      timestamp: new Date('2024-04-02T10:30:00'),
      read: true
    },
    {
      id: 2,
      conversationId: 1,
      senderId: 999,
      receiverId: 1,
      senderName: 'Vous',
      senderAvatar: '/assets/avatar.jpg',
      text: 'Bonjour, je suis intéressé par votre collection Printemps. Est-elle disponible ?',
      timestamp: new Date('2024-04-02T10:32:00'),
      read: true
    },
    {
      id: 3,
      conversationId: 1,
      senderId: 1,
      receiverId: 999,
      senderName: 'Marie Dubois',
      senderAvatar: '/assets/artisan1.jpg',
      text: 'Oui, elle est disponible ! Je peux vous proposer une personnalisation si vous le souhaitez.',
      timestamp: new Date('2024-04-02T10:35:00'),
      read: true
    }
  ];
  
  private conversationsSubject = new BehaviorSubject<Conversation[]>(this.conversations);
  private messagesSubject = new BehaviorSubject<Message[]>(this.messages);
  
  constructor() {}
  
  /**
   * Récupère toutes les conversations de l'utilisateur
   */
  getConversations(): Observable<Conversation[]> {
    return this.conversationsSubject.asObservable();
  }
  
  /**
   * Récupère les messages d'une conversation spécifique
   */
  getConversationMessages(conversationId: number): Observable<Message[]> {
    return this.messagesSubject.pipe(
      map(messages => messages.filter(message => message.conversationId === conversationId))
    );
  }
  
  /**
   * Récupère une conversation spécifique
   */
  getConversation(conversationId: number): Observable<Conversation | undefined> {
    return this.conversationsSubject.pipe(
      map(conversations => conversations.find(conv => conv.id === conversationId))
    );
  }
  
  /**
   * Envoie un message
   */
  sendMessage(conversationId: number, receiverId: number, text: string): void {
    if (!text.trim()) return;
    
    // Trouver la conversation
    const conversation = this.conversations.find(conv => conv.id === conversationId);
    
    if (!conversation) return;
    
    // Récupérer les informations du destinataire
    const receiver = conversation.participants.find(p => p.id === receiverId);
    
    if (!receiver) return;
    
    // Créer le nouveau message
    const newMessage: Message = {
      id: this.getNextMessageId(),
      conversationId,
      senderId: this.currentUserId,
      receiverId,
      senderName: 'Vous',
      senderAvatar: '/assets/avatar.jpg',
      text,
      timestamp: new Date(),
      read: false
    };
    
    // Ajouter le message
    this.messages.push(newMessage);
    this.messagesSubject.next([...this.messages]);
    
    // Mettre à jour le dernier message de la conversation
    conversation.lastMessage = {
      text,
      timestamp: new Date(),
      read: false
    };
    
    this.conversationsSubject.next([...this.conversations]);
    
    // Simuler une réponse de l'artisan après un délai
    this.simulateResponse(conversationId, receiverId);
  }
  
  /**
   * Simule une réponse automatique (pour la démo)
   */
  private simulateResponse(conversationId: number, senderId: number): void {
    setTimeout(() => {
      const conversation = this.conversations.find(conv => conv.id === conversationId);
      
      if (!conversation) return;
      
      const sender = conversation.participants.find(p => p.id === senderId);
      
      if (!sender) return;
      
      const responses = [
        'Merci pour votre message. Je vous réponds dès que possible !',
        'Je suis en train de consulter mes disponibilités et je reviens vers vous rapidement.',
        'Votre demande m\'intéresse beaucoup. Pourriez-vous me préciser vos attentes ?',
        'Je serais ravi(e) de discuter de votre projet plus en détail. Quand seriez-vous disponible pour un appel ?'
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const responseMessage: Message = {
        id: this.getNextMessageId(),
        conversationId,
        senderId,
        receiverId: this.currentUserId,
        senderName: sender.name,
        senderAvatar: sender.avatar,
        text: randomResponse,
        timestamp: new Date(),
        read: true
      };
      
      this.messages.push(responseMessage);
      this.messagesSubject.next([...this.messages]);
      
      conversation.lastMessage = {
        text: randomResponse,
        timestamp: new Date(),
        read: true
      };
      
      this.conversationsSubject.next([...this.conversations]);
    }, 1000);
  }
  
  /**
   * Crée une nouvelle conversation
   */
  createConversation(participant: { id: number; name: string; avatar: string }): number {
    // Vérifier si une conversation existe déjà
    const existingConversation = this.conversations.find(conv => 
      conv.participants.some(p => p.id === participant.id)
    );
    
    if (existingConversation) {
      return existingConversation.id;
    }
    
    // Créer une nouvelle conversation
    const newConversation: Conversation = {
      id: this.getNextConversationId(),
      participants: [
        { id: this.currentUserId, name: 'Vous', avatar: '/assets/avatar.jpg' },
        participant
      ]
    };
    
    this.conversations.push(newConversation);
    this.conversationsSubject.next([...this.conversations]);
    
    return newConversation.id;
  }
  
  /**
   * Marque les messages d'une conversation comme lus
   */
  markConversationAsRead(conversationId: number): void {
    let updated = false;
    
    this.messages.forEach(message => {
      if (message.conversationId === conversationId && 
          message.receiverId === this.currentUserId && 
          !message.read) {
        message.read = true;
        updated = true;
      }
    });
    
    if (updated) {
      this.messagesSubject.next([...this.messages]);
      
      // Mettre à jour le statut de lecture du dernier message
      const conversation = this.conversations.find(conv => conv.id === conversationId);
      if (conversation && conversation.lastMessage) {
        conversation.lastMessage.read = true;
        this.conversationsSubject.next([...this.conversations]);
      }
    }
  }
  
  /**
   * Génère le prochain ID de message disponible
   */
  private getNextMessageId(): number {
    return Math.max(...this.messages.map(message => message.id), 0) + 1;
  }
  
  /**
   * Génère le prochain ID de conversation disponible
   */
  private getNextConversationId(): number {
    return Math.max(...this.conversations.map(conv => conv.id), 0) + 1;
  }
}
