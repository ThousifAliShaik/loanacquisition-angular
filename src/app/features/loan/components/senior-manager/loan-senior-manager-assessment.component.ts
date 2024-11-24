import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanService } from '../../services/loan.service';
import { LoanApplicationExtendedDTO, LoanApplicationDTO, LoanApprovalDTO, UnderwriterAssessmentDTO, RiskAssessmentDTO, ComplianceAssessmentDTO } from '../../../../core/models/loan-application.model';

@Component({
  selector: 'app-loan-detail-senior-manager-review',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid" *ngIf="application">
      <div class="card">
        <div class="card-header">
          <h3>Loan Application Details</h3>
        </div>
        <div class="card-body">

          <!-- Loan Application Details -->
          <div class="card mb-3">
            <div class="card-header">
              <h5>Application Information</h5>
            </div>
            <div class="card-body">
              <p><strong>Loan Amount:</strong> {{ application.loanApplication.loanAmount | currency }}</p>
              <p><strong>Loan Type:</strong> {{ application.loanApplication.loanType }}</p>
              <p><strong>Status:</strong> 
                <span [class]="'badge ' + getStatusClass(application.loanApplication.applicationStatus)">
                  {{ application.loanApplication.applicationStatus }}
                </span>
              </p>
              <p><strong>Created At:</strong> {{ application.loanApplication.createdAt | date }}</p>
              <p><strong>Last Updated:</strong> {{ application.loanApplication.updatedAt | date }}</p>
            </div>
          </div>

          <div *ngIf="finalApprovalStatus" class="text-center mt-4">
            <button class="btn btn-secondary" (click)="goBack()">
              Back to List
            </button>
          </div>

        </div>
      </div>
    </div>
  `
})
export class LoanSeniorManagerAssessmentComponent implements OnInit {
  application: LoanApplicationExtendedDTO | null = null;
  finalApprovalStatus: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loanService: LoanService
  ) {}

  ngOnInit() {
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadApplication(id);
    }
  }

  goBack() {
    this.router.navigate(['review/applications']);
  }

  loadApplication(id: string) {
    this.loanService.getLoanApplicationExtended(id).subscribe({
      next: (application) => {
        if (application) {
          this.application = application;
          console.log(application);
        } else {
            
          this.router.navigate(['/applications']);
        }
      },
      error: (error) => {
        console.error('Error loading application:', error);
        this.router.navigate(['/applications']);
      }
    });
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
      'VERIFIED': 'bg-success',
      'REJECTED': 'bg-danger',
      'UNVERIFIED': 'bg-danger',
      'LOW': 'bg-secondary',
      'MEDIUM': 'bg-primary',
      'HIGH': 'bg-warning'
    };
    return status ? statusClasses[status] || 'bg-secondary' : 'bg-secondary';
  }
  
}
