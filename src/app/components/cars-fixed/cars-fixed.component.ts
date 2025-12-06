import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cars-fixed',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h2>Available Cars - Fixed Version</h2>
      <div *ngFor="let car of cars">
        <h3>{{car.model}}</h3>
        <p>Type: {{car.type}} | Year: {{car.year}} | Rate: ${{car.dailyRate}} | Status: {{car.status}}</p>
      </div>
    </div>
  `
})
export class CarsFixedComponent {
  cars = [
    { model: 'Toyota Camry', type: 'Sedan', year: 2022, dailyRate: 45, status: 'Available' },
    { model: 'Honda CR-V', type: 'SUV', year: 2023, dailyRate: 55, status: 'Available' },
    { model: 'Ford Mustang', type: 'Sports', year: 2021, dailyRate: 75, status: 'Rented' }
  ];
}
