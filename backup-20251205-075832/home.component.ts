import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface User {
  name: string;
  email: string;
  rentals: any[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  carCount: number = 0;
  userCount: number = 0;
  loading: boolean = true;

  async ngOnInit() {
    await this.loadDataFromBackend();
  }

  async loadDataFromBackend() {
    this.loading = true;
    
    try {
      // Load cars from backend
      const carsResponse = await fetch('https://autorent-k8dr.onrender.com/api/cars');
      if (carsResponse.ok) {
        const cars = await carsResponse.json();
        this.carCount = cars.length;
      }
      
      // Load users from backend (if available)
      try {
        const usersResponse = await fetch('https://autorent-k8dr.onrender.com/api/users');
        if (usersResponse.ok) {
          const users = await usersResponse.json();
          this.userCount = users.length;
        }
      } catch (userError) {
        console.log('Users API might not be available:', userError);
      }
      
    } catch (error) {
      console.log('Error loading from backend:', error);
    } finally {
      this.loading = false;
    }
  }
}
