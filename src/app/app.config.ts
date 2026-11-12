import { ApplicationConfig, ɵprovideZonelessChangeDetection as provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(), // Enable Zoneless change detection in Angular 17
    provideRouter(routes),
    // Reuse the prerendered DOM instead of repainting it, so CSS entrances never restart
    provideClientHydration()
  ]
};
