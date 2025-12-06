import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'cars', pathMatch: 'full' },
  { 
    path: 'cars', 
    loadComponent: () => import('./pages/cars/cars.component').then(m => m.CarsComponent) 
  }
];
