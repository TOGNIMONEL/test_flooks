import { Injectable } from '@angular/core';
import { Badge } from '../components/artisan-badge/artisan-badge.component';

@Injectable({
  providedIn: 'root'
})
export class BadgeService {
  private badges: Badge[] = [
    {
      id: 'certified',
      name: 'Artisan Certifié',
      icon: 'fa-certificate',
      color: '#4CAF50',
      description: 'Artisan vérifié par notre équipe'
    },
    {
      id: 'expert',
      name: 'Expert',
      icon: 'fa-award',
      color: '#FF9800',
      description: 'Plus de 10 ans d\'expérience dans son domaine'
    },
    {
      id: 'eco',
      name: 'Éco-responsable',
      icon: 'fa-leaf',
      color: '#8BC34A',
      description: 'Utilise des matériaux et méthodes respectueux de l\'environnement'
    },
    {
      id: 'local',
      name: 'Production Locale',
      icon: 'fa-map-marker-alt',
      color: '#2196F3',
      description: 'Produits fabriqués localement'
    },
    {
      id: 'handmade',
      name: '100% Fait Main',
      icon: 'fa-hands',
      color: '#9C27B0',
      description: 'Tous les produits sont entièrement faits à la main'
    },
    {
      id: 'quality',
      name: 'Qualité Premium',
      icon: 'fa-star',
      color: '#FFC107',
      description: 'Produits de qualité exceptionnelle'
    },
    {
      id: 'traditional',
      name: 'Méthodes Traditionnelles',
      icon: 'fa-history',
      color: '#795548',
      description: 'Utilise des techniques traditionnelles ancestrales'
    },
    {
      id: 'innovation',
      name: 'Innovation',
      icon: 'fa-lightbulb',
      color: '#00BCD4',
      description: 'Intègre des techniques innovantes dans son artisanat'
    },
    {
      id: 'mof',
      name: 'Meilleur Ouvrier de France',
      icon: 'fa-trophy',
      color: '#F44336',
      description: 'Détenteur du titre de Meilleur Ouvrier de France'
    }
  ];

  constructor() { }

  getAllBadges(): Badge[] {
    return [...this.badges];
  }

  getBadgeById(id: string): Badge | undefined {
    return this.badges.find(badge => badge.id === id);
  }

  getBadgesByIds(ids: string[]): Badge[] {
    return this.badges.filter(badge => ids.includes(badge.id));
  }

  // Cette méthode attribue automatiquement des badges en fonction des caractéristiques de l'artisan
  getAutomaticBadges(artisan: any): string[] {
    const badgeIds: string[] = [];
    
    // Vérification pour le badge "Certifié"
    if (artisan.certified) {
      badgeIds.push('certified');
    }
    
    // Vérification pour le badge "Expert"
    if (artisan.experience && artisan.experience >= 10) {
      badgeIds.push('expert');
    }
    
    // Vérification pour le badge "Éco-responsable"
    if (artisan.ecoFriendly) {
      badgeIds.push('eco');
    }
    
    // Vérification pour le badge "Production Locale"
    if (artisan.localProduction) {
      badgeIds.push('local');
    }
    
    // Vérification pour le badge "100% Fait Main"
    if (artisan.handmade) {
      badgeIds.push('handmade');
    }
    
    // Vérification pour "Meilleur Ouvrier de France"
    if (artisan.certifications && 
        artisan.certifications.some((cert: string) => cert.includes('Meilleur Ouvrier de France'))) {
      badgeIds.push('mof');
    }
    
    // Vérification pour "Méthodes Traditionnelles"
    if (artisan.traditionalMethods) {
      badgeIds.push('traditional');
    }
    
    // Vérification pour "Innovation"
    if (artisan.innovative) {
      badgeIds.push('innovation');
    }
    
    // Vérification pour "Qualité Premium"
    if (artisan.rating && artisan.rating >= 4.5) {
      badgeIds.push('quality');
    }
    
    return badgeIds;
  }

  // Méthode pour obtenir les badges d'un artisan en fonction de ses attributs
  getBadgesForArtisan(artisan: any): Badge[] {
    // Détermine automatiquement les badges à attribuer
    const badgeIds = this.getAutomaticBadges(artisan);
    
    // Ajoute des badges spécifiques en fonction des attributs
    if (artisan.experience >= 10) {
      badgeIds.push('expert');
    }
    
    if (artisan.rating >= 4.5) {
      badgeIds.push('quality');
    }
    
    // Par défaut, tous les artisans sont certifiés sur notre plateforme
    if (!badgeIds.includes('certified')) {
      badgeIds.push('certified');
    }
    
    // Par défaut, tous les artisans utilisent des méthodes 100% manuelles
    if (!badgeIds.includes('handmade')) {
      badgeIds.push('handmade');
    }
    
    // Élimine les doublons
    const uniqueBadgeIds = [...new Set(badgeIds)];
    
    // Récupère les objets Badge correspondants
    return this.getBadgesByIds(uniqueBadgeIds);
  }
}
