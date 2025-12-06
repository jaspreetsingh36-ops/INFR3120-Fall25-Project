import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  color: string;
  price: number;
  mileage: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class MockCarService {
  private carsSubject = new BehaviorSubject<Car[]>(this.getMockCars());
  private usersSubject = new BehaviorSubject<User[]>(this.getMockUsers());
  
  cars$ = this.carsSubject.asObservable();
  users$ = this.usersSubject.asObservable();
  
  private getMockCars(): Car[] {
    return [
      { id: 1, make: 'Toyota', model: 'Camry', year: 2022, color: 'Blue', price: 25000, mileage: 15000 },
      { id: 2, make: 'Honda', model: 'Civic', year: 2023, color: 'Red', price: 22000, mileage: 5000 },
      { id: 3, make: 'Ford', model: 'F-150', year: 2021, color: 'Black', price: 35000, mileage: 25000 },
      { id: 4, make: 'Tesla', model: 'Model 3', year: 2023, color: 'White', price: 45000, mileage: 10000 },
      { id: 5, make: 'BMW', model: 'X5', year: 2022, color: 'Gray', price: 55000, mileage: 18000 },
      { id: 6, make: 'Mercedes', model: 'C-Class', year: 2023, color: 'Silver', price: 48000, mileage: 8000 }
    ];
  }
  
  private getMockUsers(): User[] {
    return [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
    ];
  }
  
  async loadInitialData(): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Mock data loaded successfully');
  }
}
