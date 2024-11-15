import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoanService } from '../services/loan.service';
import { AuthService } from '../../../core/services/auth.service';
import { LoanApplication, LoanStatus } from '../../../core/models/loan-application.model';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-loan-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid" *ngIf="application">
      <div class="row">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h3>Review Application {{ application.id }}</h3>
              <span [class]="'badge ' + getStatusClass(application.status)">
                {{ application.status }}
              </span>
            </div>
            <div class="card-body">
              <div class="row mb-4">
                <div class="col-md-6">
                  <h5>Applicant Details</h5>
                  <p><strong>Name:</strong> {{ application.applicantName }}</p>
                  <p><strong>Email:</strong> {{ application.applicantEmail }}</p>
                  <p><strong>Loan Amount:</strong> {{ application.loanAmount | currency }}</p>
                  <p><strong>Purpose:</strong> {{ application.purpose }}</p>
                </div>
                <div class="col-md-6">
                  <h5>Application Status</h5>
                  <p><strong>Created:</strong> {{ application.createdAt | date }}</p>
                  <p><strong>Last Updated:</strong> {{ application.updatedAt | date }}</p>
                  <p><strong>Assigned Underwriter:</strong> {{ application.assignedUnderwriter || 'Not assigned' }}</p>
                  <p><strong>Assigned Risk Analyst:</strong> {{ application.assignedRiskAnalyst || 'Not assigned' }}</p>
                </div>
              </div>

              <div class="mb-4">
                <h5>Documents</h5>
                <div class="list-group">
                  <div class="list-group-item" *ngFor="let doc of application.documents">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <i class="bi bi-file-earmark-text me-2"></i>
                        {{ doc.name }}
                      </div>
                      <button class="btn btn-sm btn-primary">
                        <i class="bi bi-download"></i> Download
                      </button>
                    </div>
                  </div>
                  <div class="list-group-item text-center" *ngIf="application.documents.length === 0">
                    No documents uploaded
                  </div>
                </div>
              </div>

              <div class="mb-4">
                <h5>Comments</h5>
                <div class="list-group">
                  <div class="list-group-item" *ngFor="let comment of application.comments">
                    <div class="d-flex justify-content-between">
                      <strong>{{ comment.author }}</strong>
                      <small>{{ comment.createdAt | date:'short' }}</small>
                    </div>
                    <p class="mb-0">{{ comment.text }}</p>
                  </div>
                </div>
              </div>

              <form [formGroup]="reviewForm" (ngSubmit)="onSubmit()" *ngIf="canReview">
                <div class="mb-3">
                  <label class="form-label">Review Comment</label>
                  <textarea 
                    class="form-control" 
                    formControlName="comment" 
                    rows="3"
                  ></textarea>
                </div>
                <div class="d-flex gap-2">
                  <button 
                    type="button" 
                    class="btn btn-success" 
                    (click)="updateStatus(LoanStatus.APPROVED)"
                  >
                    Approve
                  </button>
                  <button 
                    type="button" 
                    class="btn btn-danger" 
                    (click)="updateStatus(LoanStatus.REJECTED)"
                  >
                    Reject
                  </button>
                  <button 
                    type="button" 
                    class="btn btn-warning" 
                    (click)="updateStatus(LoanStatus.PENDING_DOCUMENTS)"
                  >
                    Request Documents
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card">
            <div class="card-header">
              <h5>Review Timeline</h5>
            </div>
            <div class="card-body">
              <div class="timeline">
                <div class="timeline-item" *ngFor="let event of reviewTimeline">
                  <div class="timeline-marker"></div>
                  <div class="timeline-content">
                    <h6>{{ event.status }}</h6>
                    <p>{{ event.comment }}</p>
                    <small>{{ event.date | date:'short' }} - {{ event.user }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .timeline {
      position: relative;
      padding: 20px 0;
    }
    .timeline-item {
      position: relative;
      padding-left: 30px;
      margin-bottom: 20px;
    }
    .timeline-marker {
      position: absolute;
      left: 0;
      top: 0;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--primary-color);
      border: 2px solid #fff;
    }
    .timeline-item::before {
      content: '';
      position: absolute;
      left: 5px;
      top: 12px;
      bottom: -20px;
      width: 2px;
      background: #e9ecef;
    }
    .timeline-item:last-child::before {
      display: none;
    }
  `]
})
export class LoanReviewComponent implements OnInit {
  application: LoanApplication | null = null;
  reviewForm: FormGroup;
  canReview = false;
  LoanStatus = LoanStatus;
  reviewTimeline: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private loanService: LoanService,
    private authService: AuthService
  ) {
    this.reviewForm = this.formBuilder.group({
      comment: ['']
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadApplication(id);
    }
    this.checkReviewPermissions();
  }

  loadApplication(id: string) {
    this.loanService.getApplicationById(id).subscribe({
      next: (application) => {
        if (application) {
          this.application = application;
          this.loadReviewTimeline();
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

  checkReviewPermissions() {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.canReview = [
        UserRole.UNDERWRITER,
        UserRole.RISK_ANALYST,
        UserRole.COMPLIANCE_OFFICER,
        UserRole.MANAGER,
        UserRole.SENIOR_MANAGER
      ].includes(currentUser.role as UserRole);
    }
  }

  loadReviewTimeline() {
    // Mock timeline data
    this.reviewTimeline = [
      {
        status: 'Application Submitted',
        comment: 'Initial application submission',
        date: new Date(2024, 0, 1),
        user: 'System'
      },
      {
        status: 'Under Review',
        comment: 'Application assigned to underwriter',
        date: new Date(2024, 0, 2),
        user: 'John Smith'
      }
    ];
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

  updateStatus(status: LoanStatus) {
    if (!this.application) return;

    const comment = this.reviewForm.get('comment')?.value;
    const updates = {
      status,
      comments: [
        ...this.application.comments,
        {
          id: `COM${Date.now()}`,
          text: comment,
          author: this.authService.currentUserValue?.username || 'Unknown',
          createdAt: new Date()
        }
      ]
    };

    this.loanService.updateApplication(this.application.id, updates).subscribe({
      next: (updatedApplication) => {
        this.application = updatedApplication;
        this.reviewForm.reset();
      },
      error: (error) => {
        console.error('Error updating application:', error);
      }
    });
  }

  onSubmit() {
    if (this.reviewForm.valid && this.application) {
      this.updateStatus(this.application.status);
    }
  }
}