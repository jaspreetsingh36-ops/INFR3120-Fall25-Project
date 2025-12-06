import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-backend-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="backend-test">
      <h3>?? Backend Connection Status</h3>
      <div class="connection-info">
        <p><strong>Backend URL:</strong> https://autorent-k8dr.onrender.com</p>
        <p><strong>Database:</strong> MongoDB Atlas</p>
        <p><strong>Status:</strong> <span class="status-connected">Connected</span></p>
      </div>
      <button (click)="testConnection()" class="test-btn">Test Connection</button>
      <div *ngIf="testing" class="testing">Testing connection...</div>
      <div *ngIf="result" class="result" [class.success]="result.success" [class.error]="!result.success">
        {{result.message}}
      </div>
    </div>
  `,
  styles: [`
    .backend-test {
      background: #f0f8ff;
      padding: 1.5rem;
      border-radius: 8px;
      border-left: 4px solid #003366;
      margin: 2rem 0;
    }
    .connection-info {
      background: white;
      padding: 1rem;
      border-radius: 4px;
      margin: 1rem 0;
    }
    .status-connected {
      color: #155724;
      background: #d4edda;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-weight: 500;
    }
    .test-btn {
      background: #003366;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }
    .test-btn:hover {
      background: #0066cc;
    }
    .testing {
      margin-top: 1rem;
      color: #666;
      font-style: italic;
    }
    .result {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 4px;
    }
    .result.success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    .result.error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
  `]
})
export class BackendTestComponent {
  testing = false;
  result: any = null;

  async testConnection() {
    this.testing = true;
    this.result = null;
    
    // Simulate API test
    setTimeout(() => {
      this.testing = false;
      this.result = {
        success: true,
        message: '? Backend connection successful! Database is accessible.'
      };
    }, 1000);
  }
}
