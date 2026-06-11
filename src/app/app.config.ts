import { ApplicationConfig, ɵprovideZonelessChangeDetection as provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(), // Enable Zoneless change detection in Angular 17
    provideRouter(routes)
  ]
};
