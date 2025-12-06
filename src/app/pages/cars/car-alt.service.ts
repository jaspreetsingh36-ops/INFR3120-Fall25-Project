import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Car {
  _id?: string;
  model: string;
  type: string;
  price: number;
  status: string;
  description: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarAltService {
  private mockCars: Car[] = [
    {
      _id: '1',
      model: 'Terrain',
      type: 'SUV',
      price: 75,
      status: 'available',
      description: 'A comfortable SUV for family trips',
      imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400'
    },
    {
      _id: '2',
      model: 'Model S',
      type: 'Sedan',
      price: 120,
      status: 'available',
      description: 'Luxury electric sedan',
      imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w-400'
    }
  ];

  getAllCars(): Observable<Car[]> {
    return of(this.mockCars);
  }

  testConnection(): Observable<any> {
    return of({ status: 'Mock connection successful', timestamp: new Date() });
  }
}
