import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanService } from '../services/loan.service';
import { LoanApplication } from '../../../core/models/loan-application.model';

@Component({
  selector: 'app-loan-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid" *ngIf="application">
      <div class="card">
        <div class="card-header">
          <h3>Application Details</h3>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <h5>Applicant Information</h5>
              <p><strong>Name:</strong> {{ application.applicantName }}</p>
              <p><strong>Email:</strong> {{ application.applicantEmail }}</p>
              <p><strong>Loan Amount:</strong> {{ application.loanAmount | currency }}</p>
              <p><strong>Purpose:</strong> {{ application.purpose }}</p>
            </div>
            <div class="col-md-6">
              <h5>Application Status</h5>
              <p>
                <strong>Status:</strong>
                <span [class]="'badge ' + getStatusClass(application.status)">
                  {{ application.status }}
                </span>
              </p>
              <p><strong>Created:</strong> {{ application.createdAt | date }}</p>
              <p><strong>Last Updated:</strong> {{ application.updatedAt | date }}</p>
            </div>
          </div>

          <div class="mt-4">
            <h5>Documents</h5>
            <div class="list-group">
              <div class="list-group-item" *ngFor="let doc of application.documents">
                <div class="d-flex justify-content-between align-items-center">
                  <span>{{ doc.name }}</span>
                  <button class="btn btn-sm btn-primary">Download</button>
                </div>
              </div>
              <div class="list-group-item text-center" *ngIf="application.documents.length === 0">
                No documents uploaded
              </div>
            </div>
          </div>

          <div class="mt-4">
            <h5>Comments</h5>
            <div class="list-group">
              <div class="list-group-item" *ngFor="let comment of application.comments">
                <div class="d-flex justify-content-between">
                  <strong>{{ comment.author }}</strong>
                  <small>{{ comment.createdAt | date:'short' }}</small>
                </div>
                <p class="mb-0">{{ comment.text }}</p>
              </div>
              <div class="list-group-item text-center" *ngIf="application.comments.length === 0">
                No comments yet
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoanDetailComponent implements OnInit {
  application: LoanApplication | null = null;

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

  loadApplication(id: string) {
    this.loanService.getApplicationById(id).subscribe({
      next: (application) => {
        if (application) {
          this.application = application;
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