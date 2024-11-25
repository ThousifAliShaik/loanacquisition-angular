import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardMetricsComponent } from './components/dashboard-metrics.component';
import { DashboardService } from './services/dashboard.service';
import { UserRole } from '../../core/models/user.model';
import { LoanApplicationDTO } from '../../core/models/loan-application.model';
import { LoanService } from '../loan/services/loan.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbModule, DashboardMetricsComponent],
  template: `
    <div class="container mt-4">
      <div class="row">
        
        <div class="col-md-9">
          <!-- Dashboard Content -->
          <h2 class="mb-4">Dashboard</h2>
          
          <!-- Admin Dashboard View -->
          <div *ngIf="userRole === userRoles.ADMIN">
            <div class="row">
              <div class="col-md-3 mb-4" *ngFor="let metric of adminMetrics">
                <div class="card dashboard-tile" [ngClass]="metric.colorClass">
                  <div class="card-body text-center">
                    <i [class]="metric.icon" class="fs-4 mb-3"></i>
                    <h5>{{ metric.label }}</h5>
                    <p class="fs-4">{{ metric.value }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Loan Officer Dashboard View -->
          <div *ngIf="userRole !== userRoles.ADMIN">
            <app-dashboard-metrics></app-dashboard-metrics>
            
            <!-- Recent Applications Table -->
            <div class="card mt-4">
              <div class="card-header">
                Recent Applications
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Create Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let application of recentApplications">
                        <td>{{ application.loanId }}</td>
                        <td>{{ application.loanAmount | currency }}</td>
                        <td>
                          <span [class]="'badge ' + getStatusClass(application.applicationStatus || '')">
                            {{ application.applicationStatus }}
                          </span>
                        </td>
                        <td>{{ application.createdAt | date }}</td>
                        <td>
                          <button class="btn btn-sm btn-primary me-2" 
                                  [routerLink]="['/applications', application.loanId]">
                            View
                          </button>
                          <button *ngIf="userRole === 'LOAN_OFFICER'" class="btn btn-sm btn-secondary" 
                                  [routerLink]="['/applications', application.loanId, 'edit']">
                            Edit
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  currentRoute = '/';
  recentApplications: LoanApplicationDTO[] = [];
  adminMetrics = [
    { label: 'Total Users', value: 100, icon: 'bi bi-person-circle', colorClass: 'bg-primary' },
    { label: 'Pending Registrations', value: 20, icon: 'bi bi-hourglass-split', colorClass: 'bg-warning' },
    { label: 'Active Users', value: 80, icon: 'bi bi-person-check', colorClass: 'bg-success' },
    { label: 'Disabled Users', value: 10, icon: 'bi bi-person-x', colorClass: 'bg-danger' }
  ];
  userRole!: UserRole;

  userRoles = UserRole;

  constructor(
    private dashboardService: DashboardService,
    private loanService: LoanService
  ) {}

  ngOnInit() {
    this.userRole = this.getUserRoleFromLocalStorage();
    if (this.userRole === UserRole.ADMIN) {
      this.loadAdminMetrics();
    }
    if (this.userRole !== UserRole.ADMIN) {
      this.loadRecentApplications();
    }
  }

  private loadAdminMetrics() {
    this.dashboardService.getAdminMetrics().subscribe(
      (data) => {
        this.adminMetrics = [
          { label: 'Total Users', value: data.totalUsers, icon: 'bi bi-person-circle', colorClass: 'bg-primary' },
          { label: 'Pending Registrations', value: data.pendingRegistrations, icon: 'bi bi-hourglass-split', colorClass: 'bg-warning' },
          { label: 'Active Users', value: data.activeUsers, icon: 'bi bi-person-check', colorClass: 'bg-success' },
          { label: 'Disabled Users', value: data.disabledUsers, icon: 'bi bi-person-x', colorClass: 'bg-danger' }
        ];
      },
      (error) => {
        console.error('Error loading admin metrics', error);
      }
    );
  }

  private getUserRoleFromLocalStorage(): UserRole {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      return user.role;
    }
    return UserRole.LOAN_OFFICER;
  }

  private loadRecentApplications() {
    this.loanService.getRecentApplications().subscribe(
      applications => this.recentApplications = applications
    );
  }

  getStatusClass(status: string | undefined): string {
    const statusClasses: { [key: string]: string } = {
      'DRAFT': 'bg-secondary',
      'SUBMITTED': 'bg-primary',
      'UNDER_REVIEW': 'bg-warning',
      'PENDING': 'bg-warning',
      'PENDING_DOCUMENTS': 'bg-info',
      'FURTHER_REVIEW': 'big-info',
      'APPROVED': 'bg-success',
      'APPROVE': 'bg-success',
      'VERIFIED': 'bg-success',
      'REJECTED': 'bg-danger',
      'REJECT': 'bg-danger',
      'UNVERIFIED': 'bg-danger',
      'LOW': 'bg-secondary',
      'MEDIUM': 'bg-primary',
      'HIGH': 'bg-warning'
    };
    return status ? statusClasses[status] || 'bg-secondary' : 'bg-secondary';
  }
}
