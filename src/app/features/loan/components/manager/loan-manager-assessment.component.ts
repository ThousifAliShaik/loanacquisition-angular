import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanService } from '../../services/loan.service';
import { LoanApplicationExtendedDTO, LoanApprovalDTO, UnderwriterAssessmentDTO } from '../../../../core/models/loan-application.model';
import { FormsModule } from '@angular/forms';
import { UnderwriterService } from '../../services/underwriter.service';
import { ManagerService } from '../../services/manager.service';

@Component({
  selector: 'app-loan-detail-maanger-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

          <!-- Loan Lender Details -->
          <div class="card mb-3">
            <div class="card-header">
              <h5>Lender Information</h5>
            </div>
            <div class="card-body">
              <p><strong>Lender Name:</strong> {{ application.lenderDetails.lenderName }}</p>
              <p><strong>Registration Number:</strong> {{ application.lenderDetails.registrationNumber }}</p>
              <p><strong>Lender Type:</strong> {{ application.lenderDetails.lenderType }}</p>
              <p><strong>Risk Score:</strong> {{ application.lenderDetails.riskScore }}</p>
            </div>
          </div>

          <!-- Documents Section -->
          <div class="card mb-3">
            <div class="card-header">
              <h5>Loan Documents</h5>
            </div>
            <div class="card-body">
              <div *ngFor="let document of application.loanApplication.loanDocuments">
                <p>
                  <strong *ngIf="document.documentType === 'LOAN_REQUEST'">Loan Application Form:</strong>
                  <strong *ngIf="document.documentType === 'LOAN_AGREEMENT'">Loan Agreement Document:</strong>
                  <strong *ngIf="document.documentType === 'INCOME_VERIFICATION'">Income Verification Document:</strong>
                  <strong *ngIf="document.documentType === 'COMPLIANCE_REGULATORY'">Compliance & Regulatory Document:</strong>
                  <strong *ngIf="document.documentType === 'COLLATERAL'">Collateral Document:</strong> 
                  <i *ngIf="document.documentName.endsWith('.pdf')" class="fa fa-file-pdf"></i>
                  <a [href]="getFileDownloadLink(document)" download="{{document.documentName}}">
                    {{ document.documentName }}
                  </a>
                </p>
              </div>
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
              <p><strong>Assessment Date:</strong> {{ application.riskAssessment?.assessmentDate | date:'short' || 'N/A' }}</p>
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

          <!-- Conditional rendering: Display either the form or the read-only assessment details -->
          <div *ngIf="!assessmentSubmitted">
            <!-- Underwriter Review Fields (Editable form) -->
            <div class="card mb-3">
              <div class="card-header">
                <h5>Manager Review</h5>
              </div>
              <div class="card-body">

                <!-- Remarks -->
                <div class="form-group">
                  <label for="remarks">Remarks</label>
                  <textarea 
                    id="remarks" 
                    class="form-control" 
                    [(ngModel)]="reviewData.remarks" 
                    placeholder="Enter any remarks"
                  ></textarea>
                </div>

                <div *ngIf="!assessmentSubmitted" class="text-center mt-4">
                  <!-- Approve Button -->
                  <button class="btn btn-success me-3" (click)="approveLoan()">
                      Approve
                  </button>
                  
                  <!-- Reject Button -->
                  <button class="btn btn-danger" (click)="rejectLoan()">
                      Reject
                  </button>
                </div>

              </div>
            </div>
          </div>

          <div *ngIf="notificationMessage" 
              [ngClass]="{
                'notification-popup': true,
                'show': notificationMessage,
                'success-popup': isSuccess, 
                'error-popup': !isSuccess
              }">
            {{ notificationMessage }}
          </div>

          <div *ngIf="assessmentSubmitted">
            <!-- Read-only Assessment Details (After Submission) -->
            <div class="card mb-3">
              <div class="card-header">
                <h5>Manager Assessment Details</h5>
              </div>
              <div class="card-body">
                <p><strong>Approval Status:</strong>
                  <span [class]="'badge ' + getStatusClass(reviewData.approvalStatus)">
                    {{ reviewData.approvalStatus || 'N/A' }}
                  </span>
                </p>
                <p><strong>Remarks:</strong> {{ assessmentDetails.remarks || 'N/A' }}</p>
                <p><strong>Assessment Date:</strong> {{ assessmentDetails.approvalDate | date:'short' }}</p>
              </div>
            </div>
          </div>
          <div class="text-center mt-4">
            <button class="btn btn-secondary" (click)="goBack()">
              Back to List
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
   styles: [`
    .notification-popup {
      position: fixed;
      bottom: 20px;
      left: 60%;
      transform: translateX(-50%);
      padding: 10px 20px;
      border-radius: 5px;
      color: #fff;
      font-size: 16px;
      z-index: 9999;
      opacity: 0; /* Initially hidden */
      visibility: hidden; /* Initially hidden */
      transition: opacity 0.3s ease, visibility 0.3s ease; /* Add visibility transition */
    }

    .notification-popup.show {
      opacity: 1; /* Make visible */
      visibility: visible; /* Ensure visibility */
    }

    .success-popup {
      background-color: #28a745;
    }

    .error-popup {
      background-color: #dc3545;
    }
  `],
})
export class LoanManagerAssessmentComponent implements OnInit, OnDestroy {
  application: LoanApplicationExtendedDTO | null = null;
  finalApprovalStatus: string | null = null;
  incomeVerificationStatuses = ['VERIFIED', 'UNVERIFIED', 'PENDING'];
  assessmentOutcomes = ['APPROVE', 'REJECT', 'FURTHER_REVIEW'];

  notificationMessage: string | null = null;
  isSuccess: boolean = false;

  
  reviewData: LoanApprovalDTO = {
    approvalId: '',
    approverId: '',
    loanId: '',
    approverName: '',
    approverRoleName: '',
    approvalLevel: 0,
    approvalStatus: '',
    remarks: '',
    approvalDate: '',
    SLA: ''
  };

  // Flag to toggle between form view and assessment details view
  assessmentSubmitted = false;

  // Holds the assessment details after submission
  assessmentDetails: LoanApprovalDTO = {
    approvalId: '',
    approverId: '',
    loanId: '',
    approverName: '',
    approverRoleName: '',
    approvalLevel: 0,
    approvalStatus: '',
    remarks: '',
    approvalDate: '',
    SLA: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loanService: LoanService,
    private managerService: ManagerService
  ) {}

  ngOnInit() {
    window.addEventListener('beforeunload', this.handlePageReload.bind(this));
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadApplication(id);
    }
    this.reviewData.loanId = id || '';
  }

  ngOnDestroy(): void {
    window.removeEventListener('beforeunload', this.handlePageReload.bind(this));
  }

  handlePageReload(event: BeforeUnloadEvent): void {
    event.preventDefault();
    this.router.navigate(['review/applications']);
  }

  goBack() {
    this.router.navigate(['review/applications']);
  }

  loadApplication(id: string) {
    this.loanService.getLoanApplicationExtended(id).subscribe({
      next: (application) => {
        if (application) {
          this.application = application;
          this.application?.loanApprovals.forEach(approval => {
            if (approval.approverRoleName === 'MANAGER' && approval.approvalStatus !== 'PENDING') {
              this.router.navigate(['review/applications']);
            }
          });
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

  // Get the status class for displaying status
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

  rejectLoan() {
    this.reviewData.approvalStatus= 'REJECTED';
    this.application?.loanApprovals.forEach(approval => {
      if (approval.approverRoleName === 'MANAGER') {
        this.reviewData.approvalId = approval.approvalId;
      }
    });
    this.submitReview();
  }

  approveLoan() {
    this.reviewData.approvalStatus= 'APPROVED';
    this.application?.loanApprovals.forEach(approval => {
      if (approval.approverRoleName === 'MANAGER') {
        console.log(approval.approvalId);
        this.reviewData.approvalId = approval.approvalId;
      }
    });
    this.submitReview();
  }

  submitReview() {
    const reviewPayload: LoanApprovalDTO = {
      approvalId: this.reviewData.approvalId,
      approverId: '',
      loanId: this.reviewData.loanId,
      approverName: '',
      approverRoleName: '',
      approvalLevel: 0,
      approvalStatus: this.reviewData.approvalStatus,
      remarks: this.reviewData.remarks,
      approvalDate: new Date().toISOString(),
      SLA: ''
    };

    this.managerService.submitManagerReview(reviewPayload).subscribe({
      next: (response) => {
        console.log('Review submitted successfully:', response);
        // Set the assessment details and change the view
        this.assessmentDetails = response;
        this.assessmentSubmitted = true;
        this.notificationMessage = 'Review submitted successfully!';
        this.isSuccess = true;
        this.hideNotificationAfterDelay();
      },
      error: (error) => {
        this.notificationMessage = 'Review submission failed!';
        this.isSuccess = false;
        console.error('Error submitting review:', error);
        this.hideNotificationAfterDelay();
      }
    });
  }

  hideNotificationAfterDelay() {
    setTimeout(() => {
      this.notificationMessage = null;
    }, 3000);
  }

  getFileDownloadLink(document: any): string {
    if (document.fileContent !== '') {
      return 'data:application/pdf;base64,'+ document.fileContent;
    }
    return '';
  }
}
