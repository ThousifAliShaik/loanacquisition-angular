import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SignUpRequest, ApiResponse } from '../../../core/models/auth.model';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="signup-container">
  <div class="signup-row justify-content-center mt-5">
    <div class="signup-col-md-6 signup-col-lg-4">
      <div class="signup-card shadow">
        <div class="signup-card-body">
          <h2 class="signup-title text-center mb-4">LAMS Registration</h2>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <!-- Email field -->
            <div class="signup-field mb-3">
              <label for="email" class="signup-form-label">Email</label>
              <input
                type="email"
                class="signup-form-control"
                id="email"
                formControlName="email"
                [ngClass]="{ 'is-invalid': submitted && f['email'].errors }"
              />
              <div class="invalid-feedback" *ngIf="submitted && f['email'].errors">
                Valid email is required
              </div>
            </div>

            <!-- Username field -->
            <div class="signup-field mb-3">
              <label for="username" class="signup-form-label">Username</label>
              <input
                type="text"
                class="signup-form-control"
                id="username"
                formControlName="username"
                [ngClass]="{ 'is-invalid': submitted && f['username'].errors }"
              />
              <div class="invalid-feedback" *ngIf="submitted && f['username'].errors">
                Username is required
              </div>
            </div>

            <!-- Password field -->
            <div class="signup-field mb-3">
              <label for="password" class="signup-form-label">Password</label>
              <input
                type="password"
                class="signup-form-control"
                id="password"
                formControlName="password"
                [ngClass]="{ 'is-invalid': submitted && f['password'].errors }"
              />
              <div class="invalid-feedback" *ngIf="submitted && f['password'].errors">
                Password must be at least 6 characters
              </div>
            </div>

            <!-- Error message -->
            <div class="alert alert-danger" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>

            <!-- Success message -->
            <div class="alert alert-success" *ngIf="successMessage">
              {{ successMessage }}
            </div>

            <!-- Submit button with loading state -->
            <button 
              class="signup-btn btn w-100" 
              type="submit" 
              [disabled]="loading">
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
              {{ loading ? 'Registering...' : 'Register' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>

  `,
   styles: [
    `
    /* Signup Page Specific Styles */
    .signup-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      padding: 0 15px;
    }

    .signup-card {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      padding: 30px;
      width: 100%;
      max-width: 400px;
    }

    .signup-title {
      text-align: center;
      font-size: 2rem;
      font-weight: 600;
      color: var(--primary-color); /* Primary color */
      margin-bottom: 20px;
    }

    /* Specific Form Field Labels */
    .signup-form-label {
      font-weight: 500;
      color: var(--dark-color);
      margin-bottom: 10px;
      display: block;
    }

    .signup-form-control {
      width: 100%;
      padding: 10px 15px;
      margin-bottom: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    /* Specific Button for Signup */
    .signup-btn {
      width: 100%;
      padding: 12px;
      background-color: var(--primary-color);
      color: white;
      font-weight: 600;
      border: none;
      border-radius: 30px;
      font-size: 1.2rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .signup-btn:hover {
      background-color: #9b59b6;
      transform: scale(1.05);
    }

    .signup-btn:active {
      background-color: #2980b9;
    }
  `
  ]
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    const signUpRequest: SignUpRequest = {
      email: this.f['email'].value,
      username: this.f['username'].value,
      password: this.f['password'].value
    };

    this.authService.register(signUpRequest).subscribe({
      next: (response: ApiResponse) => {
        this.loading = false;
        if (response.success) {
          this.successMessage = response.message;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage = response.message;
        }
      },
      error: (error: any) => {
        this.loading = false;
        // The error is now just a string
        this.errorMessage = typeof error === 'string' ? error : 'Registration failed. Please try again.';
      }
    });
  }
}