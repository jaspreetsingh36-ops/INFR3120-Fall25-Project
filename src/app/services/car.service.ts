import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Car {
  _id: string;
  model: string;
  type: string;
  year: number;
  dailyRate: number;
  status: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface User {
  _id: string;
  name?: string;
  email?: string;
  role?: string;
  isLoggedIn?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CarService {
  // ========== STATE MANAGEMENT ==========
  private carsSubject = new BehaviorSubject<Car[]>([]);
  private usersSubject = new BehaviorSubject<User[]>([]);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  
  // Observables
  cars$ = this.carsSubject.asObservable();
  users$ = this.usersSubject.asObservable();
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    console.log('🚗 CarService initialized');
    this.loadUserFromLocalStorage();
    this.initializeUsers(); // Set up mock users immediately
    this.loadCarsFromBackend(); // Load cars from backend
  }

  // ========== INITIALIZATION ==========
  private initializeUsers(): void {
    console.log('👥 Initializing mock users');
    const mockUsers: User[] = [
      { 
        _id: '1', 
        name: 'Admin User', 
        email: 'admin@carrental.com', 
        role: 'admin',
        isLoggedIn: false
      },
      { 
        _id: '2', 
        name: 'Regular User', 
        email: 'user@carrental.com', 
        role: 'user',
        isLoggedIn: false
      }
    ];
    this.usersSubject.next(mockUsers);
  }

  // ========== CAR DATA LOADING ==========
  private async loadCarsFromBackend(): Promise<void> {
    try {
      console.log('📡 Loading cars from backend...');
      const backendUrl = 'https://autorent-k8dr.onrender.com/api/cars';
      console.log(`Backend URL: ${backendUrl}`);
      
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`Response status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const cars = await response.json();
      
      if (cars && Array.isArray(cars)) {
        console.log(`✅ Successfully loaded ${cars.length} cars from backend`);
        this.carsSubject.next(cars);
      } else {
        console.warn('⚠️ No cars data received');
        this.carsSubject.next([]);
      }
    } catch (error) {
      console.error('❌ Failed to load cars:', error);
      this.carsSubject.next([]);
    }
  }

  // ========== USER MANAGEMENT ==========
  private loadUserFromLocalStorage(): void {
    try {
      const userJson = localStorage.getItem('currentUser');
      if (userJson) {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
        console.log('👤 Loaded user from localStorage');
      }
    } catch (error) {
      console.error('Failed to load user from localStorage:', error);
    }
  }

  // ========== PUBLIC METHODS ==========
  login(email: string, password: string): boolean {
    const users = this.usersSubject.value;
    const user = users.find(u => u.email === email);
    
    if (user) {
      const loggedInUser = { ...user, isLoggedIn: true };
      this.currentUserSubject.next(loggedInUser);
      localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
      console.log(`✅ User logged in: ${email}`);
      return true;
    }
    
    // Accept any email with 'admin' for testing
    if (email.includes('admin')) {
      const adminUser: User = { 
        _id: 'admin_' + Date.now(),
        email, 
        name: 'Administrator', 
        role: 'admin', 
        isLoggedIn: true 
      };
      this.currentUserSubject.next(adminUser);
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      console.log(`✅ Admin logged in: ${email}`);
      return true;
    }
    
    console.log(`❌ Login failed: ${email}`);
    return false;
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    console.log('✅ User logged out');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'admin' || user?.email?.includes('admin') || false;
  }

  searchCars(query: string): Car[] {
    if (!query.trim()) return this.carsSubject.value;
    
    const searchTerm = query.toLowerCase();
    return this.carsSubject.value.filter(car =>
      car.model.toLowerCase().includes(searchTerm) ||
      car.type.toLowerCase().includes(searchTerm) ||
      car.description?.toLowerCase().includes(searchTerm) ||
      car.year.toString().includes(searchTerm)
    );
  }

  getBackendStatus(): string {
    return 'online';
  }

  testBackendConnection(): Promise<boolean> {
    return new Promise((resolve) => {
      fetch('https://autorent-k8dr.onrender.com/api/cars')
        .then(response => {
          console.log('🔌 Backend connection test:', response.ok);
          resolve(response.ok);
        })
        .catch(error => {
          console.error('🔌 Backend connection test failed:', error);
          resolve(false);
        });
    });
  }

  refreshAllData(): Observable<{ cars: Car[], users: User[] }> {
    return new Observable(subscriber => {
      this.loadCarsFromBackend().then(() => {
        subscriber.next({
          cars: this.carsSubject.value,
          users: this.usersSubject.value
        });
        subscriber.complete();
      }).catch(error => subscriber.error(error));
    });
  }

  createCar(carData: Omit<Car, '_id'>): Observable<Car> {
    return new Observable(subscriber => {
      const newCar: Car = {
        ...carData,
        _id: `temp_${Date.now()}`,
        status: carData.status || 'Available',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const currentCars = this.carsSubject.value;
      this.carsSubject.next([...currentCars, newCar]);
      
      subscriber.next(newCar);
      subscriber.complete();
    });
  }

  updateCar(carId: string, carData: Partial<Car>): Observable<Car> {
    return new Observable(subscriber => {
      const cars = this.carsSubject.value;
      const index = cars.findIndex(c => c._id === carId);
      
      if (index === -1) {
        subscriber.error(new Error('Car not found'));
        return;
      }
      
      const updatedCar = { 
        ...cars[index], 
        ...carData,
        updatedAt: new Date().toISOString()
      };
      
      const newCars = [...cars];
      newCars[index] = updatedCar;
      this.carsSubject.next(newCars);
      
      subscriber.next(updatedCar);
      subscriber.complete();
    });
  }

  deleteCar(carId: string): Observable<void> {
    return new Observable(subscriber => {
      const newCars = this.carsSubject.value.filter(c => c._id !== carId);
      this.carsSubject.next(newCars);
      subscriber.next();
      subscriber.complete();
    });
  }
}
