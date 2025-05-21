import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./pages/product/product.component').then(m => m.ProductComponent)
  },
  {
    path: 'explore',
    loadComponent: () => import('./pages/explore/explore.component').then(m => m.ExploreComponent)
  },
  {
    path: 'client-dashboard',
    loadComponent: () => import('./pages/client-dashboard/client-dashboard.component').then(m => m.ClientDashboardComponent)
  },
  {
    path: 'client-profile',
    loadComponent: () => import('./pages/client-profile/client-profile.component').then(m => m.ClientProfileComponent)
  },
  {
    path: 'artisan-dashboard',
    loadComponent: () => import('./pages/artisan-dashboard/artisan-dashboard.component').then(m => m.ArtisanDashboardComponent)
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'order-tracking/:id',
    loadComponent: () => import('./pages/order-tracking/order-tracking.component').then(m => m.OrderTrackingComponent)
  },
  {
    path: 'artisan/:id',
    loadComponent: () => import('./pages/artisan-profile/artisan-profile.component').then(m => m.ArtisanProfileComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/client-profile/client-profile.component').then(m => m.ClientProfileComponent)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];