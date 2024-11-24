import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LenderDTO, LenderService } from '../../services/lender.service';
import { UserDTO, LoanService } from '../../services/loan.service';

@Component({
  selector: 'app-loan-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid">
      <div class="card">
        <div class="card-header">
          <h3 *ngIf="!isSubmitted">New Loan Application</h3>
          <h3 *ngIf="isSubmitted">Loan Application Details</h3>
        </div>
        <div class="card-body">
          <!-- Notification Popup -->
          <div *ngIf="notificationMessage" class="alert" [ngClass]="isSuccess ? 'alert-success' : 'alert-danger'">
            {{ notificationMessage }}
          </div>

          <!-- Form for Loan Application -->
          <form *ngIf="!isSubmitted" [formGroup]="loanForm" (ngSubmit)="onSubmit()">
            <div class="mb-3">
              <label class="form-label">Lender</label>
              <select class="form-select" formControlName="lenderId">
                <option value="">Select Lender</option>
                <option *ngFor="let lender of lenders" [value]="lender.lenderId">{{ lender.lenderName }}</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Loan Amount</label>
              <div class="input-group">
                <span class="input-group-text">$</span>
                <input
                  type="text"
                  class="form-control"
                  formControlName="loanAmount"
                  (input)="formatAmount($event)"
                  [value]="loanForm.get('loanAmount')?.value | number:'1.0-0'"
                />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Loan Type</label>
              <select class="form-select" formControlName="loanType">
                <option value="">Select Loan Type</option>
                <option *ngFor="let type of loanTypes" [value]="type">{{ type }}</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Risk Level</label>
              <select class="form-select" formControlName="riskLevel">
                <option value="">Select Risk Level</option>
                <option *ngFor="let level of riskLevels" [value]="level">{{ level }}</option>
              </select>
            </div>

            <div class="mb-3 form-check form-switch">
              <label class="form-check-label" for="isActiveSwitch">Is Active</label>
              <input
                type="checkbox"
                class="form-check-input"
                id="isActiveSwitch"
                formControlName="isActive"
                [ngClass]="{'active-toggle': loanForm.get('isActive')?.value}"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Underwriter</label>
              <select class="form-select" formControlName="underwriterId">
                <option value="">Select Underwriter</option>
                <option *ngFor="let underwriter of underwriters" [value]="underwriter.userId">{{ underwriter.fullName }}</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Risk Analyst</label>
              <select class="form-select" formControlName="riskAnalystId">
                <option value="">Select Risk Analyst</option>
                <option *ngFor="let riskAnalyst of riskAnalysts" [value]="riskAnalyst.userId">{{ riskAnalyst.fullName }}</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Compliance Officer</label>
              <select class="form-select" formControlName="complianceOfficerId">
                <option value="">Select Compliance Officer</option>
                <option *ngFor="let complianceOfficer of complianceOfficers" [value]="complianceOfficer.userId">{{ complianceOfficer.fullName }}</option>
              </select>
            </div>

            <div *ngIf="riskLevel === 'Medium' || riskLevel === 'High'" class="mb-3">
              <label class="form-label">Manager</label>
              <select class="form-select" formControlName="managerId">
                <option value="">Select Manager</option>
                <option *ngFor="let manager of managers" [value]="manager.userId">{{ manager.fullName }}</option>
              </select>
            </div>

            <div *ngIf="riskLevel === 'High'" class="mb-3">
              <label class="form-label">Senior Manager</label>
              <select class="form-select" formControlName="seniorManagerId">
                <option value="">Select Senior Manager</option>
                <option *ngFor="let seniorManager of seniorManagers" [value]="seniorManager.userId">{{ seniorManager.fullName }}</option>
              </select>
            </div>

            <button type="submit" class="btn btn-primary">Submit Application</button>
            <button type="button" class="btn btn-secondary ms-2" (click)="onCancel()">Cancel</button>
          </form>

          <!-- Read-only view after submission -->
          <div *ngIf="isSubmitted" class="details-view">
            <div class="row mb-3">
              <div class="col-md-4">
                <label class="form-label">Lender</label>
              </div>
              <div class="col-md-8">
                <div class="read-only-value">{{ getLenderName(loanForm.get('lenderId')?.value) }}</div>
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-md-4">
                <label class="form-label">Loan Amount</label>
              </div>
              <div class="col-md-8">
                <div class="read-only-value">{{ loanForm.get('loanAmount')?.value | currency }}</div>
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-md-4">
                <label class="form-label">Loan Type</label>
              </div>
              <div class="col-md-8">
                <div class="read-only-value">{{ loanForm.get('loanType')?.value }}</div>
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-md-4">
                <label class="form-label">Risk Level</label>
              </div>
              <div class="col-md-8">
                <div class="read-only-value">{{ loanForm.get('riskLevel')?.value }}</div>
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-md-4">
                <label class="form-label">Is Active</label>
              </div>
              <div class="col-md-8">
                <div class="read-only-value">{{ loanForm.get('isActive')?.value ? 'Yes' : 'No' }}</div>
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-md-4">
                <label class="form-label">Underwriter</label>
              </div>
              <div class="col-md-8">
                <div class="read-only-value">{{ getUnderwriterName(loanForm.get('underwriterId')?.value) }}</div>
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-md-4">
                <label class="form-label">Risk Analyst</label>
              </div>
              <div class="col-md-8">
                <div class="read-only-value">{{ getRiskAnalystName(loanForm.get('riskAnalystId')?.value) }}</div>
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-md-4">
                <label class="form-label">Compliance Officer</label>
              </div>
              <div class="col-md-8">
                <div class="read-only-value">{{ getComplianceOfficerName(loanForm.get('complianceOfficerId')?.value) }}</div>
              </div>
            </div>

            <div *ngIf="riskLevel === 'LOW'" class="row mb-3">
              <div class="col-md-4">
                <label class="form-label">Manager</label>
              </div>
              <div class="col-md-8">
                <div class="read-only-value">{{ getManagerName(loanForm.get('managerId')?.value) }}</div>
              </div>
            </div>

            <div *ngIf="riskLevel === 'HIGH'" class="row mb-3">
              <div class="col-md-4">
                <label class="form-label">Senior Manager</label>
              </div>
              <div class="col-md-8">
                <div class="read-only-value">{{ getSeniorManagerName(loanForm.get('seniorManagerId')?.value) }}</div>
              </div>
            </div>

            <div class="d-flex justify-content-center mt-4">
              <button class="btn btn-primary" (click)="onDone()">Done</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .details-view {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .read-only-value {
      font-size: 1.1rem;
      padding: 10px;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 4px;
      color: #333;
    }

    .read-only-value:focus {
      outline: none;
    }

    .btn {
      margin-top: 20px;
    }

    .d-flex {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .alert {
      margin-bottom: 20px;
      font-weight: bold;
      padding: 10px;
      border-radius: 4px;
    }
  `]
})
export class LoanFormComponent implements OnInit {
  loanForm: FormGroup;
  submitted = false;
  isSubmitted = false;
  lenders: LenderDTO[] = [];
  underwriters: UserDTO[] = [];
  riskAnalysts: UserDTO[] = [];
  complianceOfficers: UserDTO[] = [];
  managers: UserDTO[] = [];
  seniorManagers: UserDTO[] = [];
  notificationMessage: string | null = null;
  isSuccess = false;

  loanTypes = ['CONVENTIONAL', 'FHA', 'VA'];
  riskLevels = ['Low', 'Medium', 'High'];

  constructor(
    private formBuilder: FormBuilder,
    private loanService: LoanService,
    private lenderService: LenderService,
    private router: Router
  ) {
    this.loanForm = this.formBuilder.group({
      lenderId: ['', Validators.required],
      loanAmount: ['', [Validators.required, Validators.min(1000)]],
      loanType: ['', Validators.required],
      riskLevel: ['', Validators.required],
      isActive: [true],
      underwriterId: ['', Validators.required],
      riskAnalystId: ['', Validators.required],
      complianceOfficerId: ['', Validators.required],
      managerId: ['', Validators.required],
      seniorManagerId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getAllLenders();
    this.getAllUnderwriters();
    this.getAllRiskAnalysts();
    this.getAllComplianceOfficers();
    this.getAllManagers();
    this.getAllSeniorManagers();
    this.loanForm.get('riskLevel')?.valueChanges.subscribe(value => {
      this.onRiskLevelChange(value);
    });
  }

  formatAmount(event: any) {
    let value = event.target.value.replace(/[^0-9]/g, '');
    if (value === '') {
      value = '0';
    }
    const formattedValue = Number(value).toLocaleString();
    this.loanForm.get('loanAmount')?.setValue(value, { emitEvent: false });
    event.target.value = formattedValue;
  }

  get f() { return this.loanForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.loanForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    this.loanService.createApplication(this.loanForm.value).subscribe({
      next: () => {
        this.isSubmitted = true;
        this.submitted = false;
        this.showNotification('Loan application submitted successfully!', true);
      },
      error: error => {
        console.error('Failed to create application:', error);
        this.showNotification('Failed to submit loan application. Please try again later.', false);
      }
    });
  }

  onCancel() {
    this.router.navigate(['/applications']);
  }

  onDone() {
    this.router.navigate(['/applications']);
  }

  showNotification(message: string, success: boolean) {
    this.notificationMessage = message;
    this.isSuccess = success;
    setTimeout(() => {
      this.notificationMessage = null;
    }, 3000);
  }

  getAllLenders() {
    this.lenderService.getAllLenders().subscribe({
      next: (data) => {
        this.lenders = data;
      },
      error: (error) => {
        console.error('Error fetching lenders:', error);
      }
    });
  }

  getAllUnderwriters() {
    this.loanService.getAllUnderwriters().subscribe({
      next: (data) => {
        this.underwriters = data;
      },
      error: (error) => {
        console.error('Error fetching underwriters:', error);
      }
    });
  }

  getAllRiskAnalysts() {
    this.loanService.getAllRiskAnalysts().subscribe({
      next: (data) => {
        this.riskAnalysts = data;
      },
      error: (error) => {
        console.error('Error fetching riskAnalysts:', error);
      }
    });
  }

  getAllComplianceOfficers() {
    this.loanService.getAllComplianceOfficers().subscribe({
      next: (data) => {
        this.complianceOfficers = data;
      },
      error: (error) => {
        console.error('Error fetching complianceOfficers:', error);
      }
    });
  }

  getAllManagers() {
    this.loanService.getAllManagers().subscribe({
      next: (data) => {
        this.managers = data;
      },
      error: (error) => {
        console.error('Error fetching managers:', error);
      }
    });
  }

  getAllSeniorManagers() {
    this.loanService.getAllSeniorManagers().subscribe({
      next: (data) => {
        this.seniorManagers = data;
      },
      error: (error) => {
        console.error('Error fetching seniorManagers:', error);
      }
    });
  }

  // Helper methods to get names by IDs
  getLenderName(lenderId: string): string {
    const lender = this.lenders.find(l => l.lenderId === lenderId);
    return lender ? lender.lenderName : '';
  }

  getUnderwriterName(underwriterId: string): string {
    const underwriter = this.underwriters.find(u => u.userId === underwriterId);
    return underwriter ? underwriter.fullName : '';
  }

  getRiskAnalystName(riskAnalystId: string): string {
    const riskAnalyst = this.riskAnalysts.find(r => r.userId === riskAnalystId);
    return riskAnalyst ? riskAnalyst.fullName : '';
  }

  getComplianceOfficerName(complianceOfficerId: string): string {
    const complianceOfficer = this.complianceOfficers.find(c => c.userId === complianceOfficerId);
    return complianceOfficer ? complianceOfficer.fullName : '';
  }

  getManagerName(managerId: string): string {
    const manager = this.managers.find(m => m.userId === managerId);
    return manager ? manager.fullName : '';
  }

  getSeniorManagerName(seniorManagerId: string): string {
    const seniorManager = this.seniorManagers.find(s => s.userId === seniorManagerId);
    return seniorManager ? seniorManager.fullName : '';
  }

  get riskLevel() {
    return this.loanForm.get('riskLevel')?.value;
  }

  onRiskLevelChange(value: string) {
    
    if (value === 'Low') {
      this.loanForm.get('managerId')?.clearValidators();
      this.loanForm.get('seniorManagerId')?.clearValidators();
      this.loanForm.patchValue({
        managerId: '', 
        seniorManagerId: ''
      });
    } else if (value === 'Medium') {
      this.loanForm.get('seniorManagerId')?.clearValidators();
      this.loanForm.patchValue({
        seniorManagerId: ''
      });
      this.loanForm.get('managerId')?.setValidators([Validators.required]);
    } else if (value === 'High') {
      this.loanForm.get('managerId')?.setValidators([Validators.required]);
      this.loanForm.get('seniorManagerId')?.setValidators([Validators.required]);
    }
    this.loanForm.get('managerId')?.updateValueAndValidity();
    this.loanForm.get('seniorManagerId')?.updateValueAndValidity();
  }
}
