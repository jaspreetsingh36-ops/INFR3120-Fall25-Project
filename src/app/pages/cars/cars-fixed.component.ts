import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarService, Car, User } from '../../services/car.service';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})
export class CarsComponent implements OnInit {
  // Data
  cars: Car[] = [];
  users: User[] = [];
  filteredCars: Car[] = [];
  currentUser: User | null = null;
  
  // UI State
  searchQuery = '';
  loading = false;
  showLoginForm = false;
  isEditMode = false;
  currentYear = new Date().getFullYear();
  statusOptions = ['Available', 'Rented', 'Maintenance'];
  
  // Backend status
  backendConnected = false;
  backendMessage = '';
  showBackendIndicator = false;
  
  // Statistics
  availableCarsCount = 0;
  rentedCarsCount = 0;
  totalCars = 0;
  averageDailyRate = 0;
  
  // Inline editing
  isEditingPrice = false;
  activePriceEditCarId: string | null = null;
  isEditingStatus = false;
  activeStatusEditCarId: string | null = null;
  isEditingDescription = false;
  activeDescriptionEditCarId: string | null = null;
  newCarPrice = '';
  newCarStatus = '';
  newCarDescription = '';
  
  // Table
  columns = [
    { key: 'model', label: 'Model' },
    { key: 'type', label: 'Type' },
    { key: 'year', label: 'Year' },
    { key: 'dailyRate', label: 'Daily Rate' },
    { key: 'status', label: 'Status' },
    { key: 'description', label: 'Description' },
    { key: 'actions', label: 'Actions' }
  ];
  
  // Forms
  loginForm = { email: '', password: '' };
  
  editForm: Partial<Car> = {
    model: '',
    type: '',
    year: new Date().getFullYear(),
    dailyRate: 0,
    status: 'Available',
    description: ''
  };
  
  editingCar: Car | null = null;

  constructor(public carService: CarService) {}

  ngOnInit(): void {
    this.carService.cars$.subscribe(cars => {
      this.cars = cars;
      this.filteredCars = cars;
      this.updateStatistics();
    });
    
    this.carService.users$.subscribe(users => {
      this.users = users;
    });
    
    this.carService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isEditMode = !!user?.isLoggedIn;
    });
    
    this.testBackendConnection();
  }

  // ========== STATISTICS ==========
  updateStatistics(): void {
    this.totalCars = this.cars.length;
    this.availableCarsCount = this.cars.filter(c => c.status === 'Available').length;
    this.rentedCarsCount = this.cars.filter(c => c.status === 'Rented').length;
    
    if (this.cars.length > 0) {
      const totalRate = this.cars.reduce((sum, car) => sum + car.dailyRate, 0);
      this.averageDailyRate = Math.round(totalRate / this.cars.length);
    }
  }

  // ========== BACKEND ==========
  testBackendConnection(): void {
    this.loading = true;
    this.carService.testBackendConnection().then(connected => {
      this.backendConnected = connected;
      this.backendMessage = connected ? 'Backend connected' : 'Backend offline';
      this.showBackendIndicator = true;
      this.loading = false;
      
      if (connected) {
        setTimeout(() => {
          this.showBackendIndicator = false;
        }, 3000);
      }
    }).catch(() => {
      this.loading = false;
      this.backendConnected = false;
      this.backendMessage = 'Connection failed';
    });
  }

  // ========== MODAL METHODS ==========
  closeModal(): void {
    this.isEditMode = false;
    this.editingCar = null;
    this.editForm = {
      model: '',
      type: '',
      year: new Date().getFullYear(),
      dailyRate: 0,
      status: 'Available',
      description: ''
    };
  }

  hideLogin(): void {
    this.showLoginForm = false;
    this.loginForm = { email: '', password: '' };
  }

  cancelEdit(): void {
    this.closeModal();
  }

  // ========== AUTHENTICATION ==========
  showLogin(): void {
    const adminUser = this.users.find(u => u.email?.includes('admin'));
    if (adminUser?.email) {
      this.loginForm.email = adminUser.email;
    }
    this.showLoginForm = true;
  }

  performLogin(): void {
    this.loading = true;
    setTimeout(() => {
      const success = this.carService.login(this.loginForm.email, this.loginForm.password);
      this.loading = false;
      if (success) {
        this.hideLogin();
      } else {
        alert('Login failed');
      }
    }, 500);
  }

  logout(): void {
    this.carService.logout();
  }

  canEdit(): boolean {
    return !!this.currentUser?.isLoggedIn;
  }

  // ========== SEARCH ==========
  searchCars(): void {
    if (this.searchQuery.trim()) {
      this.filteredCars = this.carService.searchCars(this.searchQuery);
    } else {
      this.filteredCars = [...this.cars];
    }
    this.updateStatistics();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchCars();
  }

  // ========== CRUD OPERATIONS ==========
  addNewCar(): void {
    this.editingCar = null;
    this.editForm = {
      model: '',
      type: '',
      year: new Date().getFullYear(),
      dailyRate: 0,
      status: 'Available',
      description: ''
    };
    this.isEditMode = true;
  }

  editCar(car: Car): void {
    this.editingCar = car;
    this.editForm = { ...car };
    this.isEditMode = true;
  }

  saveCar(): void {
    if (this.editingCar) {
      this.carService.updateCar(this.editingCar._id, this.editForm).subscribe({
        next: () => this.cancelEdit(),
        error: (err: any) => {
          alert('Failed to update car');
          console.error(err);
        }
      });
    } else {
      this.carService.createCar(this.editForm as Omit<Car, '_id'>).subscribe({
        next: () => this.cancelEdit(),
        error: (err: any) => {
          alert('Failed to create car');
          console.error(err);
        }
      });
    }
  }

  deleteCar(carId: string): void {
    if (confirm('Delete this car?')) {
      this.carService.deleteCar(carId).subscribe({
        next: () => console.log('Deleted'),
        error: (err: any) => {
          alert('Failed to delete');
          console.error(err);
        }
      });
    }
  }

  // ========== INLINE EDITING ==========
  updateCarPrice(car: Car, price: string): void {
    if (!this.canEdit()) return;
    
    const updatedCar = {
      ...car,
      dailyRate: parseFloat(price) || car.dailyRate
    };
    
    this.carService.updateCar(car._id, updatedCar).subscribe({
      next: () => console.log('Price updated'),
      error: (err: any) => {
        console.error('Failed to update price:', err);
        alert('Failed to update price');
      }
    });
  }

  getStatusColor(status: string): string {
    switch(status.toLowerCase()) {
      case 'available': return '#4caf50';
      case 'rented': return '#f44336';
      default: return '#757575';
    }
  }

  updateCarStatus(car: Car, status: string): void {
    if (!this.canEdit()) return;
    
    const updatedCar = {
      ...car,
      status: status
    };
    
    this.carService.updateCar(car._id, updatedCar).subscribe({
      next: () => console.log('Status updated'),
      error: (err: any) => {
        console.error('Failed to update status:', err);
        alert('Failed to update status');
      }
    });
  }

  manageCar(car: Car): void {
    if (this.canEdit()) {
      this.editCar(car);
    }
  }

  updateCarDescription(car: Car, description: string): void {
    if (!this.canEdit()) return;
    
    const updatedCar = {
      ...car,
      description: description
    };
    
    this.carService.updateCar(car._id, updatedCar).subscribe({
      next: () => console.log('Description updated'),
      error: (err: any) => {
        console.error('Failed to update description:', err);
        alert('Failed to update description');
      }
    });
  }

  // ========== UTILITIES ==========
  formatPrice(rate: number): string {
    return rate.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  }

  getActionText(): string {
    return this.canEdit() ? 'Edit' : 'View';
  }

  getDataSourceText(): string {
    return this.backendConnected ? 'Backend' : 'Local';
  }

  loadDataFromDatabase(): void {
    this.loading = true;
    this.carService.refreshAllData().subscribe({
      next: () => {
        this.loading = false;
        this.testBackendConnection();
        alert('Data refreshed from backend!');
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Failed to refresh data:', err);
        alert('Failed to refresh data');
      }
    });
  }
}



