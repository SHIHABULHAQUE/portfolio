import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

// One page, so it ships in the main bundle: no second request before first paint.
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '' }
];
