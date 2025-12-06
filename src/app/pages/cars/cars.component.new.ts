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
  cars: Car[] = [];
  filteredCars: Car[] = [];
  currentUser: User | null = null;
  searchQuery = '';
  loading = false;
  
  // Simple properties for the template
  showLoginForm = false;
  isEditMode = false;
  currentYear = new Date().getFullYear();
  statusOptions = ['Available', 'Rented', 'Maintenance'];
  
  // Form data
  loginForm = {
    email: '',
    password: ''
  };
  
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
    });
    
    this.carService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isEditMode = !!user?.isLoggedIn;
    });
  }

  // Basic methods
  showLogin(): void {
    this.showLoginForm = true;
    const adminUser = this.carService.users$.value?.find(u => u.email?.includes('admin'));
    if (adminUser?.email) {
      this.loginForm.email = adminUser.email;
    }
  }

  hideLogin(): void {
    this.showLoginForm = false;
    this.loginForm = { email: '', password: '' };
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

  searchCars(): void {
    this.filteredCars = this.carService.searchCars(this.searchQuery);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchCars();
  }

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
        next: () => {
          this.cancelEdit();
        },
        error: (err) => {
          alert('Failed to update car');
          console.error(err);
        }
      });
    } else {
      this.carService.createCar(this.editForm as Omit<Car, '_id'>).subscribe({
        next: () => {
          this.cancelEdit();
        },
        error: (err) => {
          alert('Failed to create car');
          console.error(err);
        }
      });
    }
  }

  cancelEdit(): void {
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

  deleteCar(carId: string): void {
    if (confirm('Delete this car?')) {
      this.carService.deleteCar(carId).subscribe({
        next: () => console.log('Deleted'),
        error: (err) => {
          alert('Failed to delete');
          console.error(err);
        }
      });
    }
  }

  formatPrice(rate: number): string {
    return rate.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  }

  getActionText(): string {
    return this.currentUser?.isLoggedIn ? 'Edit' : 'View';
  }

  testBackendConnection(): void {
    this.loading = true;
    this.carService.testBackendConnection().then(connected => {
      this.loading = false;
      alert(connected ? 'Backend connected!' : 'Backend offline');
    }).catch(() => {
      this.loading = false;
      alert('Connection test failed');
    });
  }
}
