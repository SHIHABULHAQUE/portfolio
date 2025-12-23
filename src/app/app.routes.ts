import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/hero/hero.component').then(m => m.HeroComponent) },
  { path: 'about', loadComponent: () => import('./pages/home/ai-experience/ai-experience.component').then(m => m.AiExperienceComponent) },
  { path: 'experience', loadComponent: () => import('./pages/home/experience/experience.component').then(m => m.ExperienceComponent) },
  { path: 'projects', loadComponent: () => import('./pages/home/projects/projects.component').then(m => m.ProjectsComponent) },
  { path: 'contact', loadComponent: () => import('./pages/home/contact/contact.component').then(m => m.ContactComponent) },
];
