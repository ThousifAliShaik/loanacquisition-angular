import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanService } from '../../services/loan.service';
import { LoanApplicationExtendedDTO } from '../../../../core/models/loan-application.model';

@Component({
  selector: 'app-loan-detail',
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

          <!-- Loan Approvals Section -->
          <div class="card mb-3">
            <div class="card-header">
              <h5>Approval Details</h5>
            </div>
            <div class="card-body">
              <div *ngIf="application.loanApprovals.length > 0; else noApprovals">
                <div *ngFor="let approval of application.loanApprovals" class="border-bottom pb-2 mb-2">
                  <p><strong>Approver:</strong> {{ approval.approverName }} ({{ approval.approverRoleName }})</p>
                  <p><strong>Status:</strong>
                    <span [class]="'badge ' + getStatusClass(approval.approvalStatus)">
                      {{ approval.approvalStatus }}
                    </span>
                  </p>
                  <p><strong>Remarks:</strong> {{ approval.remarks || 'N/A' }}</p>
                  <p><strong>Approval Date:</strong> {{ approval.approvalDate | date:'short' }}</p>
                </div>
              </div>
              <ng-template #noApprovals>No approvals recorded</ng-template>
            </div>
          </div>

          <!-- Underwriter Assessment Section -->
          <div class="card mb-3">
            <div class="card-header">
              <h5>Underwriter Assessment</h5>
            </div>
            <div class="card-body">
              <p><strong>Loan to Value Ratio:</strong> {{ application.underwriterAssessment?.loanToValueRatio || 'N/A' }}</p>
              <p><strong>Income Verification:</strong>
                <span [class]="'badge ' + getStatusClass(application.underwriterAssessment?.incomeVerificationStatus)">
                  {{ application.underwriterAssessment?.incomeVerificationStatus || 'N/A' }}
                </span>
              </p>
              <p><strong>Outcome:</strong>
                <span [class]="'badge ' + getStatusClass(application.underwriterAssessment?.assessmentOutcome)">
                  {{ application.underwriterAssessment?.assessmentOutcome || 'N/A' }}
                </span>
              </p>
              <p><strong>Remarks:</strong> {{ application.underwriterAssessment?.remarks || 'N/A' }}</p>
              <p><strong>Assessment Date:</strong> {{ application.underwriterAssessment?.assessmentDate | date:'short' }}</p>

            </div>
          </div>

          <!-- Risk Assessment Section -->
          <div class="card mb-3">
            <div class="card-header">
              <h5>Risk Assessment</h5>
            </div>
            <div class="card-body">
              <p><strong>Debt to Income Ratio:</strong> {{ application.riskAssessment?.debtToIncomeRatio || 'N/A' }}</p>
              <p><strong>Credit Score:</strong> {{ application.riskAssessment?.creditScore || 'N/A' }}</p>
              <p><strong>Risk Category:</strong>
                <span [class]="'badge ' + getStatusClass(application.riskAssessment?.riskCategory)">
                  {{ application.riskAssessment?.riskCategory || 'N/A' }}
                </span>
              </p>
              <p><strong>Remarks:</strong> {{ application.riskAssessment?.remarks || 'N/A' }}</p>
              <p><strong>Assessment Date:</strong> {{ application.riskAssessment?.assessmentDate | date:'short' || 'N/A'}}</p>
            </div>
          </div>

          <!-- Compliance Assessment Section -->
          <div class="card mb-3">
            <div class="card-header">
              <h5>Compliance Assessment</h5>
            </div>
            <div class="card-body">
              <p><strong>Compliance Status:</strong>
                <span [class]="'badge ' + getStatusClass(application.complianceAssessment?.complianceStatus)">
                  {{ application.complianceAssessment?.complianceStatus || 'N/A' }}
                </span>
              </p>
              <p><strong>Remarks:</strong> {{ application.complianceAssessment?.remarks || 'N/A' }}</p>
              <p><strong>Assessment Date:</strong> {{ application.complianceAssessment?.assessmentDate | date:'short' }}</p>
            </div>
          </div>

          <div class="text-center mt-4">
            <button class="btn btn-primary" (click)="goBack()">
              Back to List
            </button>
          </div>

        </div>
      </div>
    </div>
  `
})
export class LoanDetailComponent implements OnInit {
  application: LoanApplicationExtendedDTO | null = null;

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
    this.router.navigate(['/applications']);
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
