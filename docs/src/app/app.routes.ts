import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home').then(m => m.HomeComponent),
  },
  {
    path: 'getting-started',
    loadComponent: () => import('./pages/getting-started').then(m => m.GettingStartedComponent),
  },
  {
    path: 'configuration',
    loadComponent: () => import('./pages/configuration').then(m => m.ConfigurationComponent),
  },
  {
    path: 'configuration/ghost-mode',
    loadComponent: () => import('./pages/ghost-mode').then(m => m.GhostModeComponent),
  },
  {
    path: 'deployment',
    loadComponent: () => import('./pages/deployment').then(m => m.DeploymentComponent),
  },
  {
    path: 'api',
    loadComponent: () => import('./pages/api').then(m => m.ApiComponent),
  },
  // Redirect unknown routes to home
  {
    path: '**',
    redirectTo: '',
  },
];
