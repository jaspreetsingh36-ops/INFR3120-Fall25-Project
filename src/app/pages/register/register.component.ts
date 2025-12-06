import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>?? Register for AutoRent</h2>
        <form (ngSubmit)="register()">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              [(ngModel)]="name" 
              name="name" 
              required 
              placeholder="Enter your full name"
            >
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              [(ngModel)]="email" 
              name="email" 
              required 
              placeholder="Enter your email"
            >
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              [(ngModel)]="password" 
              name="password" 
              required 
              placeholder="Create a password"
            >
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              [(ngModel)]="confirmPassword" 
              name="confirmPassword" 
              required 
              placeholder="Confirm your password"
            >
          </div>
          <button type="submit" class="auth-btn">Register</button>
        </form>
        <p class="auth-link">Already have an account? <a href="/login">Login here</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    .auth-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    .auth-card h2 {
      color: #003366;
      text-align: center;
      margin-bottom: 1.5rem;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
      font-weight: 500;
    }
    .form-group input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }
    .form-group input:focus {
      border-color: #0066cc;
      outline: none;
    }
    .auth-btn {
      width: 100%;
      background: #003366;
      color: white;
      border: none;
      padding: 0.75rem;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.3s;
    }
    .auth-btn:hover {
      background: #0066cc;
    }
    .auth-link {
      text-align: center;
      margin-top: 1.5rem;
      color: #666;
    }
    .auth-link a {
      color: #0066cc;
      text-decoration: none;
      font-weight: 500;
    }
    .auth-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  register() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert(`Registration attempt for: ${this.name} (${this.email})`);
  }
}
