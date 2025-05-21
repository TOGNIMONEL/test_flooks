import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-collaboration-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="collaboration-tab">
      <h1>Espace Collaboration</h1>
      
      <div class="collaboration-grid">
        <div class="collaboration-card ideas">
          <div class="card-header">
            <h2>Proposer une idée</h2>
          </div>
          <div class="card-content">
            <div class="idea-form">
              <input 
                type="text" 
                placeholder="Titre de votre idée" 
                [(ngModel)]="newIdea.title">
              <textarea 
                placeholder="Décrivez votre idée en détail..." 
                [(ngModel)]="newIdea.description"></textarea>
              <div class="form-footer">
                <button class="btn btn-primary" (click)="submitIdea()">Soumettre</button>
              </div>
            </div>
            
            <div class="ideas-list">
              <h3>Idées de la communauté</h3>
              
              <div *ngFor="let idea of ideas" class="idea-card">
                <div class="idea-header">
                  <img [src]="idea.userAvatar" [alt]="idea.userName" class="avatar">
                  <div class="idea-meta">
                    <h4>{{ idea.title }}</h4>
                    <span class="author">{{ idea.userName }}</span>
                  </div>
                  <div class="idea-votes">
                    <button class="vote-btn" (click)="toggleVote(idea)">
                      <i class="fas" [class.fa-thumbs-up]="!idea.voted" [class.fa-thumbs-down]="idea.voted"></i>
                      <span>{{ idea.votes }}</span>
                    </button>
                  </div>
                </div>
                
                <p class="idea-description">{{ idea.description }}</p>
                
                <div class="idea-footer">
                  <button class="btn-link" (click)="toggleComments(idea)">
                    <i class="fas fa-comment"></i> 
                    {{ idea.comments.length }} commentaires
                  </button>
                </div>
                
                <div *ngIf="idea.showComments" class="comments-section">
                  <div *ngFor="let comment of idea.comments" class="comment">
                    <img [src]="comment.userAvatar" [alt]="comment.userName" class="avatar-small">
                    <div class="comment-content">
                      <div class="comment-header">
                        <span class="comment-author">{{ comment.userName }}</span>
                        <span class="comment-date">{{ comment.date | date:'short' }}</span>
                      </div>
                      <p>{{ comment.text }}</p>
                    </div>
                  </div>
                  
                  <div class="add-comment">
                    <input 
                      type="text" 
                      placeholder="Ajouter un commentaire..." 
                      [(ngModel)]="idea.newComment"
                      (keyup.enter)="addComment(idea)">
                    <button class="btn btn-sm" (click)="addComment(idea)">Envoyer</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="collaboration-card workshops">
          <div class="card-header">
            <h2>Ateliers collaboratifs</h2>
          </div>
          <div class="card-content">
            <div class="workshops-list">
              <div *ngFor="let workshop of workshops" class="workshop-card">
                <div class="workshop-image">
                  <img [src]="workshop.image" [alt]="workshop.title">
                  <span class="workshop-date">{{ workshop.date | date:'dd MMM' }}</span>
                </div>
                <div class="workshop-info">
                  <h3>{{ workshop.title }}</h3>
                  <p class="workshop-description">{{ workshop.description }}</p>
                  <div class="workshop-meta">
                    <span class="participants">
                      <i class="fas fa-users"></i> {{ workshop.participants }} participants
                    </span>
                    <button class="btn btn-primary btn-sm">S'inscrire</button>
                  </div>
                </div>
              </div>
              
              <div *ngIf="workshops.length === 0" class="empty-state">
                <p>Aucun atelier prévu pour le moment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .collaboration-tab {
      padding: 1rem;
    }
    
    h1 {
      margin-bottom: 2rem;
    }
    
    .collaboration-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
    }
    
    .collaboration-card {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: var(--shadow);
    }
    
    .card-header {
      padding: 1.5rem;
      background: var(--primary-color);
      color: white;
    }
    
    .card-header h2 {
      margin: 0;
    }
    
    .card-content {
      padding: 1.5rem;
    }
    
    .idea-form {
      margin-bottom: 2rem;
    }
    
    .idea-form input,
    .idea-form textarea {
      width: 100%;
      padding: 0.75rem;
      margin-bottom: 1rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
    }
    
    .idea-form textarea {
      min-height: 120px;
      resize: vertical;
    }
    
    .form-footer {
      display: flex;
      justify-content: flex-end;
    }
    
    .ideas-list h3 {
      margin-bottom: 1.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--border-color);
    }
    
    .idea-card {
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border-color);
    }
    
    .idea-header {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 1rem;
    }
    
    .idea-meta {
      flex: 1;
    }
    
    .idea-meta h4 {
      margin: 0 0 0.25rem;
    }
    
    .author {
      font-size: 0.9rem;
      color: var(--text-light);
    }
    
    .idea-votes {
      margin-left: 1rem;
    }
    
    .vote-btn {
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-light);
    }
    
    .vote-btn i {
      color: var(--primary-color);
    }
    
    .idea-description {
      margin-bottom: 1rem;
    }
    
    .idea-footer {
      display: flex;
      justify-content: flex-end;
    }
    
    .btn-link {
      background: none;
      border: none;
      color: var(--primary-color);
      cursor: pointer;
    }
    
    .comments-section {
      margin-top: 1rem;
      padding: 1rem;
      background: var(--background-alt);
      border-radius: 8px;
    }
    
    .comment {
      display: flex;
      margin-bottom: 1rem;
    }
    
    .avatar-small {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 0.75rem;
    }
    
    .comment-content {
      flex: 1;
    }
    
    .comment-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.25rem;
    }
    
    .comment-author {
      font-weight: bold;
      font-size: 0.9rem;
    }
    
    .comment-date {
      font-size: 0.8rem;
      color: var(--text-light);
    }
    
    .comment-content p {
      margin: 0;
      font-size: 0.9rem;
    }
    
    .add-comment {
      display: flex;
      gap: 0.5rem;
    }
    
    .add-comment input {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
    }
    
    .workshops-list {
      display: grid;
      gap: 1.5rem;
    }
    
    .workshop-card {
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
    }
    
    .workshop-image {
      position: relative;
      height: 150px;
    }
    
    .workshop-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .workshop-date {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
    }
    
    .workshop-info {
      padding: 1rem;
    }
    
    .workshop-info h3 {
      margin: 0 0 0.5rem;
    }
    
    .workshop-description {
      margin-bottom: 1rem;
      font-size: 0.9rem;
      color: var(--text-light);
    }
    
    .workshop-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .participants {
      font-size: 0.9rem;
      color: var(--text-light);
    }
    
    .empty-state {
      text-align: center;
      padding: 2rem;
      background: var(--background-alt);
      border-radius: 8px;
    }
    
    @media (max-width: 992px) {
      .collaboration-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CollaborationTabComponent {
  @Input() user: any;
  @Input() ideas: any[] = [];
  @Input() workshops: any[] = [];
  
  newIdea = {
    title: '',
    description: ''
  };
  
  submitIdea(): void {
    if (!this.newIdea.title.trim() || !this.newIdea.description.trim()) {
      return;
    }
    
    this.ideas.unshift({
      id: this.ideas.length + 1,
      title: this.newIdea.title,
      description: this.newIdea.description,
      userName: this.user.name,
      userAvatar: this.user.avatar,
      votes: 0,
      voted: false,
      comments: [],
      showComments: false,
      newComment: ''
    });
    
    this.newIdea = {
      title: '',
      description: ''
    };
  }
  
  toggleVote(idea: any): void {
    if (idea.voted) {
      idea.votes--;
    } else {
      idea.votes++;
    }
    idea.voted = !idea.voted;
  }
  
  toggleComments(idea: any): void {
    idea.showComments = !idea.showComments;
  }
  
  addComment(idea: any): void {
    if (!idea.newComment.trim()) {
      return;
    }
    
    idea.comments.push({
      id: idea.comments.length + 1,
      text: idea.newComment,
      userName: this.user.name,
      userAvatar: this.user.avatar,
      date: new Date()
    });
    
    idea.newComment = '';
  }
}
