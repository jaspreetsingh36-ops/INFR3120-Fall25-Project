import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
export class CarService {
  private apiUrl = 'https://autorent-k8dr.onrender.com/api/cars';

  constructor(private http: HttpClient) { }

  getAllCars(): Observable<Car[]> {
    return this.http.get<Car[]>(this.apiUrl);
  }

  testConnection(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
