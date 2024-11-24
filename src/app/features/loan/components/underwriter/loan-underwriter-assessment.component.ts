import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanService } from '../../services/loan.service';
import { LoanApplicationExtendedDTO, UnderwriterAssessmentDTO } from '../../../../core/models/loan-application.model';
import { FormsModule } from '@angular/forms';  // <-- Import FormsModule for ngModel
import { UnderwriterService } from '../../services/underwriter.service';

@Component({
  selector: 'app-loan-detail-underwriter-review',
  standalone: true,
  imports: [CommonModule, FormsModule],  // <-- Add FormsModule here
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
                <h5>Underwriter Review</h5>
              </div>
              <div class="card-body">
                
                <!-- Loan to Value Ratio -->
                <div class="form-group">
                  <label for="loanToValueRatio">Loan to Value Ratio</label>
                  <input 
                    type="number" 
                    id="loanToValueRatio" 
                    class="form-control" 
                    [(ngModel)]="reviewData.loanToValueRatio" 
                    placeholder="Enter Loan to Value Ratio" 
                    min="0.0" 
                    max="1.0" 
                    step="0.01"
                  />
                </div>

                <!-- Income Verification Status -->
                <div class="form-group">
                  <label for="incomeVerificationStatus">Income Verification Status</label>
                  <select 
                    id="incomeVerificationStatus" 
                    class="form-control" 
                    [(ngModel)]="reviewData.incomeVerificationStatus"
                  >
                    <option *ngFor="let status of incomeVerificationStatuses" [value]="status">{{ status }}</option>
                  </select>
                </div>

                <!-- Assessment Outcome -->
                <div class="form-group">
                  <label for="assessmentOutcome">Assessment Outcome</label>
                  <select 
                    id="assessmentOutcome" 
                    class="form-control" 
                    [(ngModel)]="reviewData.assessmentOutcome"
                  >
                    <option *ngFor="let outcome of assessmentOutcomes" [value]="outcome">{{ outcome }}</option>
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
                <h5>Underwriter Assessment Details</h5>
              </div>
              <div class="card-body">
                
                <!-- Loan to Value Ratio -->
                <div class="form-group">
                  <label for="loanToValueRatio">Loan to Value Ratio</label>
                  <input 
                    type="text" 
                    id="loanToValueRatio" 
                    class="form-control" 
                    [value]="assessmentDetails.loanToValueRatio" 
                    readonly
                  />
                </div>

                <!-- Income Verification Status -->
                <div class="form-group">
                  <label for="incomeVerificationStatus">Income Verification Status</label>
                  <input 
                    type="text" 
                    id="incomeVerificationStatus" 
                    class="form-control" 
                    [value]="assessmentDetails.incomeVerificationStatus" 
                    readonly
                  />
                </div>

                <!-- Assessment Outcome -->
                <div class="form-group">
                  <label for="assessmentOutcome">Assessment Outcome</label>
                  <input 
                    type="text" 
                    id="assessmentOutcome" 
                    class="form-control" 
                    [value]="assessmentDetails.assessmentOutcome" 
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
export class LoanUnderwriterAssessmentComponent implements OnInit, OnDestroy {
  application: LoanApplicationExtendedDTO | null = null;
  finalApprovalStatus: string | null = null;
  incomeVerificationStatuses = ['VERIFIED', 'UNVERIFIED', 'PENDING'];
  assessmentOutcomes = ['APPROVE', 'REJECT', 'FURTHER_REVIEW'];

  notificationMessage: string | null = null;
  isSuccess: boolean = false;

  
  reviewData: UnderwriterAssessmentDTO = {
    underwriterAssessmentId: '', 
    loanId: '',
    loanToValueRatio: 0,
    incomeVerificationStatus: '',
    assessmentOutcome: '',
    remarks: '',
    assessmentDate: ''
  };

  // Flag to toggle between form view and assessment details view
  assessmentSubmitted = false;

  // Holds the assessment details after submission
  assessmentDetails: UnderwriterAssessmentDTO = {
    underwriterAssessmentId: '',
    loanId: '',
    loanToValueRatio: 0,
    incomeVerificationStatus: '',
    assessmentOutcome: '',
    remarks: '',
    assessmentDate: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loanService: LoanService,
    private underwriterService: UnderwriterService
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
    const reviewPayload: UnderwriterAssessmentDTO = {
      underwriterAssessmentId: this.reviewData.underwriterAssessmentId,
      loanId: this.reviewData.loanId,
      loanToValueRatio: this.reviewData.loanToValueRatio,
      incomeVerificationStatus: this.reviewData.incomeVerificationStatus,
      assessmentOutcome: this.reviewData.assessmentOutcome,
      remarks: this.reviewData.remarks,
      assessmentDate: new Date().toISOString()
    };

    this.underwriterService.submitUnderwriterReview(reviewPayload).subscribe({
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
