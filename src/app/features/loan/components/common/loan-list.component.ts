import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoanApplicationDTO } from '../../../../core/models/loan-application.model';
import { LoanService } from '../../services/loan.service';
import { UserRole } from '../../../../core/models/user.model';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Loan Applications</h2>
        <button *ngIf="userRole === 'LOAN_OFFICER'" class="btn btn-primary" routerLink="/applications/new">
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
                <tr *ngFor="let application of pagedApplications">
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

          <!-- Pagination Controls -->
          <div class="d-flex justify-content-center mt-3">
            <button class="btn btn-sm btn-secondary" (click)="prevPage()" [disabled]="currentPage === 1">
              Previous
            </button>
            <span class="mx-3">Page {{ currentPage }} of {{ totalPages }}</span>
            <button class="btn btn-sm btn-secondary" (click)="nextPage()" [disabled]="currentPage === totalPages">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoanListComponent implements OnInit {
  applications: LoanApplicationDTO[] = [];
  pagedApplications: LoanApplicationDTO[] = [];  // Applications for the current page
  currentPage: number = 1;  // Current page number
  itemsPerPage: number = 10;  // Items to display per page
  totalPages: number = 1;  // Total number of pages
  userRole!: UserRole;

  constructor(private loanService: LoanService) {}

  ngOnInit() {
    this.userRole = this.getUserRoleFromLocalStorage();
    this.loadApplications();
  }

  private getUserRoleFromLocalStorage(): UserRole {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      return user.role;
    }
    return UserRole.LOAN_OFFICER;
  }

  loadApplications() {
    this.loanService.getApplications().subscribe(applications => {
      this.applications = applications;
      this.totalPages = Math.ceil(this.applications.length / this.itemsPerPage);
      this.updatePagedApplications();
    });
  }

  updatePagedApplications() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedApplications = this.applications.slice(startIndex, endIndex);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedApplications();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedApplications();
    }
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
