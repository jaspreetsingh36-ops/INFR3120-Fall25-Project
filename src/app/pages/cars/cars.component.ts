import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h1 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
        🚗 Car Rental System
      </h1>
      
      <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <h2 style="color: #2980b9; margin-top: 0;">Available Vehicles</h2>
        <p>Browse our selection of premium vehicles available for rent.</p>

        <p *ngIf="isLoading" style="margin-top: 10px;">Loading vehicles...</p>
        <p *ngIf="error" style="margin-top: 10px; color: #e74c3c;">{{ error }}</p>
      </div>

      <!-- Cars grid -->
      <div *ngIf="!isLoading && !error && cars.length > 0"
           style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
        <div *ngFor="let car of cars" 
             style="border: 1px solid #ddd; border-radius: 8px; padding: 20px; 
                    background: white; box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    transition: transform 0.2s;">
          
          <div style="display: flex; justify-content: space-between; align-items: start;">
            <h3 style="color: #2c3e50; margin-top: 0;">{{ car.model }}</h3>
            <span style="background: #e74c3c; color: white; padding: 3px 8px; 
                         border-radius: 12px; font-size: 12px; font-weight: bold;">
              {{ car.type }}
            </span>
          </div>
          
          <div style="margin: 15px 0;">
            <p style="margin: 5px 0;">
              <strong>📅 Year:</strong> {{ car.year }}
            </p>
            <p style="margin: 5px 0;">
              <strong>💰 Daily Rate:</strong> 
              <span style="color: #27ae60; font-weight: bold;">{{ car.dailyRate }}/day</span>
            </p>
            <p style="margin: 5px 0;">
              <strong>📊 Status:</strong> 
              <span [style.color]="car.status === 'Available' ? '#27ae60' : '#e74c3c'"
                    [style.fontWeight]="'bold'">
                {{ car.status }}
              </span>
            </p>
          </div>
          
          <button *ngIf="car.status === 'Available'"
                  style="background: #3498db; color: white; border: none; 
                         padding: 10px 20px; border-radius: 5px; width: 100%;
                         cursor: pointer; font-size: 16px;"
                  (click)="rentCar(car)">
            🚘 Rent This Car
          </button>
          
          <button *ngIf="car.status === 'Rented'"
                  style="background: #95a5a6; color: white; border: none; 
                         padding: 10px 20px; border-radius: 5px; width: 100%;
                         cursor: not-allowed; font-size: 16px;"
                  disabled>
            ⏳ Currently Rented
          </button>
        </div>
      </div>

      <!-- No cars message -->
      <div *ngIf="!isLoading && !error && cars.length === 0"
           style="margin-top: 20px; font-style: italic;">
        No vehicles found.
      </div>
      
      <!-- Summary -->
      <div *ngIf="!isLoading && cars.length > 0"
           style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 5px;">
        <h3 style="color: #2c3e50;">📈 Summary</h3>
        <p><strong>Total Cars:</strong> {{ cars.length }}</p>
        <p><strong>Available:</strong> {{ getAvailableCount() }}</p>
        <p><strong>Average Daily Rate:</strong> $ {{ getAverageRate() }}</p>
      </div>
    </div>
  `
})
export class CarsComponent implements OnInit {
  cars: any[] = [];
  isLoading = true;
  error: string | null = null;

  private api = new ApiService();

  async ngOnInit(): Promise<void> {
    try {
      this.cars = await this.api.getCars();
    } catch (err) {
      console.error(err);
      this.error = 'Failed to load cars.';
    } finally {
      this.isLoading = false;
    }
  }
  
  rentCar(car: any) {
    if (car.status === 'Available') {
      // Frontend-only change; in a real app, you'd also call the backend to update status in DB.
      car.status = 'Rented';
      alert(`You have rented the ${car.model}! Enjoy your ride! 🚗`);
    }
  }
  
  getAvailableCount(): number {
    return this.cars.filter(car => car.status === 'Available').length;
  }
  
  getAverageRate(): number {
    if (this.cars.length === 0) return 0;
    const total = this.cars.reduce((sum, car) => sum + (car.dailyRate || 0), 0);
    return Math.round(total / this.cars.length);
  }
}
