// Working minimal CarsComponent
import { Component, OnInit } from '@angular/core';
import { CarService, Car } from '../../services/car.service';

@Component({
  selector: 'app-cars',
  template: `
    <div style="padding: 20px;">
      <h1>Car Rental System</h1>
      <div *ngIf="cars.length === 0">Loading cars...</div>
      <div *ngFor="let car of cars">
        <h3>{{car.model}} ({{car.year}})</h3>
        <p>Type: {{car.type}}</p>
        <p>Daily Rate: {{car.dailyRate | currency}}</p>
        <p>Status: {{car.status}}</p>
        <p>{{car.description}}</p>
        <hr>
      </div>
    </div>
  `
})
export class CarsComponent implements OnInit {
  cars: Car[] = [];

  constructor(private carService: CarService) {}

  ngOnInit(): void {
    this.carService.cars$.subscribe(cars => {
      this.cars = cars;
      console.log('Loaded', cars.length, 'cars');
    });
  }
}
