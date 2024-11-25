import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LoanService } from '../../services/loan.service';
import { LoanApplicationDTO } from '../../../../core/models/loan-application.model';
import { User, UserRole } from '../../../../core/models/user.model';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Review Loan Applications</h2>
        
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
                <!-- Check if there are no records -->
                <tr *ngIf="pagedApplications.length === 0">
                  <td colspan="5" class="text-center">No records available</td>
                </tr>
                
                <!-- Render records if available -->
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
                    <button class="btn btn-sm btn-primary me-2" (click)="reviewLoan(application)">
                      Review
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
export class LoanReviewListComponent implements OnInit {
  currentUser: User| null = null;
  applications: LoanApplicationDTO[] = [];
  pagedApplications: LoanApplicationDTO[] = [];  // Applications for the current page
  currentPage: number = 1;  // Current page number
  itemsPerPage: number = 10;  // Items to display per page
  totalPages: number = 1;  // Total number of pages

  constructor(private loanService: LoanService, private router: Router) {}

  ngOnInit() {
    this.currentUser = this.getUserFromLocalStorage();
    this.loadApplications();
  }

  private getUserFromLocalStorage(): User | null {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
  }
  
  loadApplications() {
    if(this.currentUser?.role === 'LOAN_OFFICER') {
      this.loanService.getApplicationsForPendingFinalApproval().subscribe(applications => {
        this.applications = applications;
        this.totalPages = Math.ceil(this.applications.length / this.itemsPerPage);
        this.updatePagedApplications();
      });
    } else if(this.currentUser?.role === 'MANAGER') {
      this.loanService.getApplicationsForPendingManagerAssessment().subscribe(applications => {
        this.applications = applications;
        this.totalPages = Math.ceil(this.applications.length / this.itemsPerPage);
        this.updatePagedApplications();
      });
    } else if(this.currentUser?.role === 'SENIOR_MANAGER') {
      this.loanService.getApplicationsForPendingSeniorManagerAssessment().subscribe(applications => {
        this.applications = applications;
        this.totalPages = Math.ceil(this.applications.length / this.itemsPerPage);
        this.updatePagedApplications();
      });
    } else {
      this.loanService.getApplicationsForPendingAssessment().subscribe(applications => {
        this.applications = applications;
        this.totalPages = Math.ceil(this.applications.length / this.itemsPerPage);
        this.updatePagedApplications();
      });
    }
    
  }

  reviewLoan(application: LoanApplicationDTO) {
    if(this.currentUser?.role === 'LOAN_OFFICER') {
      this.router.navigate([`/applications/${application.loanId}/final-review`]);
    } else if(this.currentUser?.role === 'UNDERWRITER') {
      this.router.navigate([`/applications/${application.loanId}/underwriter-assessment`]);
    } else if(this.currentUser?.role === 'RISK_ANALYST') {
      console.log('Risk');
      this.router.navigate([`/applications/${application.loanId}/risk-assessment`]);
    } else if(this.currentUser?.role === 'COMPLIANCE_OFFICER') {
      this.router.navigate([`/applications/${application.loanId}/compliance-assessment`]);
    } else if(this.currentUser?.role === 'MANAGER') {
      this.router.navigate([`/applications/${application.loanId}/manager-assessment`]);
    }else if(this.currentUser?.role === 'SENIOR_MANAGER') {
      this.router.navigate([`/applications/${application.loanId}/senior-manager-assessment`]);
    }  
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

  private getUserRoleFromLocalStorage(): UserRole {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      return user.role;
    }
    return UserRole.LOAN_OFFICER;
  }
}
