
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { AuthGuard } from './app/core/guards/auth.guard';
import { jwtInterceptor } from './app/core/interceptors/jwt.interceptor';
import { errorInterceptor } from './app/core/interceptors/error.interceptor';
import { bootstrapApplication } from '@angular/platform-browser';


const routes: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./app/features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => 
      import('./app/features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadComponent: () => 
      import('./app/features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'logout',
    loadComponent: () => 
      import('./app/features/auth/logout/logout.component').then(m => m.LogoutComponent)
  },
  {
    path: 'register',
    loadComponent: () => 
      import('./app/features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('./app/features/admin/components/user-list.component').then(m => m.UserListComponent)
      },
      {
        path: 'users/new',
        loadComponent: () =>
          import('./app/features/admin/components/user-form.component').then(m => m.UserFormComponent)
      },
      {
        path: 'users/:id',
        loadComponent: () =>
          import('./app/features/admin/components/user-form.component').then(m => m.UserFormComponent)
      }
    ]
  },
  {
    path: 'applications',
    loadComponent: () =>
      import('./app/features/loan/components/loan-list.component').then(m => m.LoanListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'applications/new',
    loadComponent: () =>
      import('./app/features/loan/components/loan-form.component').then(m => m.LoanFormComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'applications/:id',
    loadComponent: () =>
      import('./app/features/loan/components/loan-detail.component').then(m => m.LoanDetailComponent)
  },
  {
    path: 'applications/:id/edit',
    loadComponent: () =>
      import('./app/features/loan/components/loan-edit.component').then(m => m.EditLoanComponent)
  },
  {
    path: 'review/applications',
    loadComponent: () =>
      import('./app/features/loan/components/loan-review-list.component').then(m => m.LoanReviewListComponent)
  },
  {
    path: 'applications/:id/final-review',
    loadComponent: () =>
      import('./app/features/loan/components/loan-final-review.component').then(m => m.LoanFinalReviewComponent)
  },
  {
    path: 'review/applications/:id',
    loadComponent: () =>
      import('./app/features/loan/components/loan-review.component').then(m => m.LoanReviewComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor, errorInterceptor]))
  ]
});