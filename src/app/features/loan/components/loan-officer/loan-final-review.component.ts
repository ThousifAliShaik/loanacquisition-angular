import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanService } from '../../services/loan.service';
import { LoanApplicationExtendedDTO, LoanApplicationDTO, LoanApprovalDTO, UnderwriterAssessmentDTO, RiskAssessmentDTO, ComplianceAssessmentDTO } from '../../../../core/models/loan-application.model';
import { ApiResponse } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-loan-detail-final-review',
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
          
          <!-- Final Approval Section -->
          <div *ngIf="finalApprovalStatus" class="card mb-3">
            <div class="card-header">
              <h5>Final Approval</h5>
            </div>
            <div class="card-body">
              <p><strong>Final Approval Status:</strong>
                <span [class]="'badge ' + getStatusClass(finalApprovalStatus)">
                  {{ finalApprovalStatus || 'N/A' }}
                </span>
              </p>
            </div>
          </div>

          <div *ngIf="finalApprovalStatus === null" class="text-center mt-4">
            <!-- Approve Button -->
            <button class="btn btn-success me-3" (click)="approveLoan(application.loanApplication.loanId || '')">
                Approve
            </button>
            
            <!-- Reject Button -->
            <button class="btn btn-danger" (click)="rejectLoan(application.loanApplication.loanId || '')">
                Reject
            </button>
          </div>

          <div *ngIf="finalApprovalStatus" class="text-center mt-4">
            <button class="btn btn-primary" (click)="generateReport(application.loanApplication?.loanId || '')">
              Generate Report
            </button>
          </div>

          <div class="text-center mt-4">
            <button class="btn btn-secondary" (click)="goBack()">
              Back to List
            </button>
          </div>

        </div>
      </div>
    </div>
  `
})
export class LoanFinalReviewComponent implements OnInit {
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
          if(application.loanApplication.finalApprovalStatus!=='PENDING') {
            this.router.navigate(['/applications']);  
          }
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

  rejectLoan(id: string) {
    this.loanService.finalRejectLoanApplication(id).subscribe({
      next: (response: ApiResponse) => {
        if(response.success) {
            this.finalApprovalStatus = 'REJECTED';
            console.log('Loan rejected:', response);
            alert('Loan has been rejected.');
        }
      },
      error: (err) => {
        console.error('Rejection failed:', err);
        alert('Error rejecting the loan.');
      }
    });
  }

  approveLoan(id: string) {
    this.loanService.finalApproveLoanApplication(id).subscribe({
      next: (response: ApiResponse) => {
        if(response.success) {
            this.finalApprovalStatus = 'APPROVED';
            console.log('Loan approved:', response);
            alert('Loan has been approved successfully!');
        }
      },
      error: (err) => {
        console.error('Approval failed:', err);
        alert('Error approving the loan.');
      }
    });
  }

  generateReport(loanId: string) {
    if (loanId) {
        this.loanService.generateLoanReport(loanId).subscribe({
          next: (response) => {
            
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `Loan_Acquisition_Report_${loanId}.pdf`; 
            a.click();  
            
            window.URL.revokeObjectURL(url);
          },
          error: (error) => {
            console.error('Error downloading report:', error);
            alert('Error generating loan acquisition report');
          }
        });
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

  getFileDownloadLink(document: any): string {
    if (document.fileContent !== '') {
      return 'data:application/pdf;base64,'+ document.fileContent;
    }
    return '';
  }
  
}
