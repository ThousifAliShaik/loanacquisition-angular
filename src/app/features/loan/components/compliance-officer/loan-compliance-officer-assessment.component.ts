import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanService } from '../../services/loan.service';
import { ComplianceAssessmentDTO, LoanApplicationExtendedDTO, RiskAssessmentDTO, UnderwriterAssessmentDTO } from '../../../../core/models/loan-application.model';
import { FormsModule } from '@angular/forms'; 
import { UnderwriterService } from '../../services/underwriter.service';
import { RiskAnalystService } from '../../services/risk-analyst.service';
import { ComplianceOfficerService } from '../../services/compliance-officer.service';

@Component({
  selector: 'app-loan-detail-risk-analyst-review',
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

          <!-- Conditional rendering: Display either the form or the read-only assessment details -->
          <div *ngIf="!assessmentSubmitted">
            <!-- Underwriter Review Fields (Editable form) -->
            <div class="card mb-3">
              <div class="card-header">
                <h5>Risk Analyst Review</h5>
              </div>
              <div class="card-body">
                

                <!-- Compliance Status -->
                <div class="form-group">
                  <label for="complianceStatus">Compliance Status</label>
                  <select 
                    id="complianceStatus" 
                    class="form-control" 
                    [(ngModel)]="reviewData.complianceStatus"
                  >
                    <option *ngFor="let status of complianceStatuses" [value]="status">{{ status }}</option>
                  </select>
                </div>

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

                <!-- Submit Button -->
                <div class="text-center mt-4">
                  <button class="btn btn-primary" (click)="submitReview()">Submit Review</button>
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
                <h5>Risk Analyst Assessment Details</h5>
              </div>
              <div class="card-body">
                
                <!-- Compliance Status -->
                <div class="form-group">
                  <label for="complianceStatus">Compliance Status</label>
                  <input 
                    type="text" 
                    id="complianceStatus" 
                    class="form-control" 
                    [value]="assessmentDetails.complianceStatus" 
                    readonly
                  />
                </div>

                <!-- Remarks -->
                <div class="form-group">
                  <label for="remarks">Remarks</label>
                  <textarea 
                    id="remarks" 
                    class="form-control" 
                    [value]="assessmentDetails.remarks" 
                    readonly
                  ></textarea>
                </div>

                <!-- Assessment Date -->
                <div class="form-group">
                  <label for="assessmentDate">Assessment Date</label>
                  <input 
                    type="text" 
                    id="assessmentDate" 
                    class="form-control" 
                    [value]="assessmentDetails.assessmentDate" 
                    readonly
                  />
                </div>
                
                <!-- Back Button -->
                <div class="text-center mt-4">
                  <button class="btn btn-secondary" (click)="goBack()">Back to List</button>
                </div>
              </div>
            </div>
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
export class LoanComplianceOfficerAssessmentComponent implements OnInit, OnDestroy {
  application: LoanApplicationExtendedDTO | null = null;
  finalApprovalStatus: string | null = null;
  incomeVerificationStatuses = ['VERIFIED', 'UNVERIFIED', 'PENDING'];
  assessmentOutcomes = ['APPROVE', 'REJECT', 'FURTHER_REVIEW'];
  riskCategories = ['LOW', 'MEDIUM', 'HIGH'];
  complianceStatuses = ['PENDING', 'APPROVED', 'REJECTED'];

  notificationMessage: string | null = null;
  isSuccess: boolean = false;

  
  reviewData: ComplianceAssessmentDTO = {
    complianceId: '', 
    loanId: '',
    complianceStatus: '',
    remarks: '',
    assessmentDate: ''
  };

  // Flag to toggle between form view and assessment details view
  assessmentSubmitted = false;

  // Holds the assessment details after submission
  assessmentDetails: ComplianceAssessmentDTO = {
    complianceId: '', 
    loanId: '',
    complianceStatus: '',
    remarks: '',
    assessmentDate: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loanService: LoanService,
    private complianceOfficerService: ComplianceOfficerService
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
      'VERIFIED': 'bg-success',
      'REJECTED': 'bg-danger',
      'UNVERIFIED': 'bg-danger',
      'LOW': 'bg-secondary',
      'MEDIUM': 'bg-primary',
      'HIGH': 'bg-warning'
    };
    return status ? statusClasses[status] || 'bg-secondary' : 'bg-secondary';
  }

  submitReview() {
    const reviewPayload: ComplianceAssessmentDTO = {
      complianceId: this.reviewData.complianceId,
      loanId: this.reviewData.loanId,
      complianceStatus: this.reviewData.complianceStatus,
      remarks: this.reviewData.remarks,
      assessmentDate: new Date().toISOString()
    };

    this.complianceOfficerService.submitComplianceOfficerReview(reviewPayload).subscribe({
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
}
