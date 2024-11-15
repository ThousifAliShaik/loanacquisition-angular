import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-container">
  <div class="login-row justify-content-center mt-5">
    <div class="login-col-md-6 login-col-lg-4">
      <div class="login-card shadow">
        <div class="login-card-body">
          <h2 class="login-title text-center mb-4">LAMS Login</h2>
          
          <form #loginForm="ngForm" (ngSubmit)="$event.preventDefault(); onSubmit()">
            <!-- Username field -->
            <div class="login-field mb-3">
              <label for="username" class="login-form-label">Username</label>
              <input
                type="text"
                class="login-form-control"
                id="username"
                name="username"
                [(ngModel)]="credentials.username"
                required
              />
            </div>

            <!-- Password field -->
            <div class="login-field mb-3">
              <label for="password" class="login-form-label">Password</label>
              <input
                type="password"
                class="login-form-control"
                id="password"
                name="password"
                [(ngModel)]="credentials.password"
                required
              />
            </div>

            <!-- Error message -->
            <div class="alert alert-danger" *ngIf="errorMessage" role="alert">
              {{ errorMessage }}
            </div>

            <!-- Submit button with loading state -->
            <button 
              class="login-btn btn w-100" 
              type="submit" 
              [disabled]="loading || !credentials.username || !credentials.password">
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
              {{ loading ? 'Logging in...' : 'Login' }}
            </button>

            <!-- Register link -->
            <div class="login-register-link text-center mt-3">
              <a routerLink="/register">Don't have an account? Sign Up</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>


  `
})
export class LoginComponent implements OnInit {
  credentials = {
    username: '',
    password: ''
  };
  loading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Redirect if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    // Clear any existing error message
    this.errorMessage = '';
    
    // Set loading state
    this.loading = true;

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error: string) => {
        this.errorMessage = error;
        this.loading = false;
        console.error('Login error:', error);
      }
    });
  }
}