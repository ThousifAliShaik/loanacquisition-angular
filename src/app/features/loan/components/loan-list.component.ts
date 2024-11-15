import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoanService } from '../services/loan.service';
import { LoanApplication, LoanApplicationDTO } from '../../../core/models/loan-application.model';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Loan Applications</h2>
        <button class="btn btn-primary" routerLink="/applications/new">
          <i class="bi bi-plus"></i> New Application
        </button>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let application of applications">
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
                    <button class="btn btn-sm btn-secondary" 
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
  `
})
export class LoanListComponent implements OnInit {
  applications: LoanApplicationDTO[] = [];

  constructor(private loanService: LoanService) {}

  ngOnInit() {
    this.loadApplications();
  }

  loadApplications() {
    this.loanService.getApplications().subscribe(
      applications => this.applications = applications
    );
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'DRAFT': 'bg-secondary',
      'SUBMITTED': 'bg-primary',
      'UNDER_REVIEW': 'bg-warning',
      'PENDING_DOCUMENTS': 'bg-info',
      'APPROVED': 'bg-success',
      'REJECTED': 'bg-danger'
    };
    return statusClasses[status] || 'bg-secondary';
  }
}