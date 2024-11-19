import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanService, UserDTO } from '../services/loan.service';
import { LenderDTO, LenderService } from '../services/lender.service';
import { LoanApplicationDTO } from '../../../core/models/loan-application.model';

@Component({
  selector: 'app-edit-loan',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid">
        <div class="card">
            <div class="card-header">
            <h3 *ngIf="!isSubmitted">Edit Loan Application</h3>
            <h3 *ngIf="isSubmitted">Loan Application Details</h3>
            </div>
            <div class="card-body">
            <!-- Notification Popup -->
            <div *ngIf="notificationMessage" class="alert" [ngClass]="isSuccess ? 'alert-success' : 'alert-danger'">
                {{ notificationMessage }}
            </div>

            <!-- Form for Editing Loan Application -->
            <form *ngIf="!isSubmitted" [formGroup]="loanForm" (ngSubmit)="onSubmit()">
                
                <!-- Lender Dropdown -->
                <div class="mb-3">
                <label class="form-label">Lender</label>
                <select class="form-select" formControlName="lenderId">
                    <option value="">Select Lender</option>
                    <option *ngFor="let lender of lenders" [value]="lender.lenderId">{{ lender.lenderName }}</option>
                </select>
                </div>

                <!-- Loan Amount -->
                <div class="mb-3">
                <label class="form-label">Loan Amount</label>
                <input type="number" class="form-control" formControlName="loanAmount" placeholder="Enter loan amount" />
                </div>

                <!-- Loan Type -->
                <div class="mb-3">
                <label class="form-label">Loan Type</label>
                <select class="form-select" formControlName="loanType">
                    <option value="">Select Loan Type</option>
                    <option *ngFor="let type of loanTypes" [value]="type">{{ type }}</option>
                </select>
                </div>

                <!-- Risk Level -->
                <div class="mb-3">
                <label class="form-label">Risk Level</label>
                <select class="form-select" formControlName="riskLevel">
                    <option value="">Select Risk Level</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                </select>
                </div>

                <!-- Is Active Checkbox -->
                <div class="form-check mb-3">
                <input type="checkbox" class="form-check-input" formControlName="isActive" />
                <label class="form-check-label">Is Active</label>
                </div>

                <!-- Underwriter Dropdown -->
                <div class="mb-3">
                <label class="form-label">Underwriter</label>
                <select class="form-select" formControlName="underwriterId">
                    <option value="">Select Underwriter</option>
                    <option *ngFor="let underwriter of underwriters" [value]="underwriter.userId">{{ underwriter.fullName }}</option>
                </select>
                </div>

                <!-- Risk Analyst Dropdown -->
                <div class="mb-3">
                <label class="form-label">Risk Analyst</label>
                <select class="form-select" formControlName="riskAnalystId">
                    <option value="">Select Risk Analyst</option>
                    <option *ngFor="let riskAnalyst of riskAnalysts" [value]="riskAnalyst.userId">{{ riskAnalyst.fullName }}</option>
                </select>
                </div>

                <!-- Compliance Officer Dropdown -->
                <div class="mb-3">
                <label class="form-label">Compliance Officer</label>
                <select class="form-select" formControlName="complianceOfficerId">
                    <option value="">Select Compliance Officer</option>
                    <option *ngFor="let complianceOfficer of complianceOfficers" [value]="complianceOfficer.userId">{{ complianceOfficer.fullName }}</option>
                </select>
                </div>

                <!-- Manager Dropdown -->
                
                <div *ngIf="riskLevel !== 'LOW'" class="mb-3">
                <label class="form-label">Manager</label>
                <select class="form-select" formControlName="managerId">
                    <option value="">Select Manager</option>
                    <option *ngFor="let manager of managers" [value]="manager.userId">{{ manager.fullName }}</option>
                </select>
                </div>

                <!-- Senior Manager Dropdown -->
                <div *ngIf="riskLevel === 'HIGH'" class="mb-3">
                <label class="form-label">Senior Manager</label>
                <select class="form-select" formControlName="seniorManagerId">
                    <option value="">Select Senior Manager</option>
                    <option *ngFor="let seniorManager of seniorManagers" [value]="seniorManager.userId">{{ seniorManager.fullName }}</option>
                </select>
                </div>

                <button type="submit" class="btn btn-primary">Update Application</button>
                <button type="button" class="btn btn-secondary ms-2" (click)="onCancel()">Cancel</button>
            </form>

            <!-- Read-only view after submission -->
            <div *ngIf="isSubmitted" class="details-view">
                <div *ngFor="let field of readOnlyFields">
                    <div *ngIf="field.value" class="row mb-3">
                        <div class="col-md-4">
                        <label class="form-label">{{ field.label }}</label>
                        </div>
                        <div class="col-md-8">
                        <div class="read-only-value">{{ field.value }}</div>
                        </div>
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
  styles: [/* Same styles as LoanFormComponent */]
})
export class EditLoanComponent implements OnInit {
  loanForm: FormGroup;
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
  readOnlyFields: { label: string; value: any }[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private loanService: LoanService,
    private lenderService: LenderService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loanForm = this.formBuilder.group({
      loanId: ['', Validators.required],
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
    const applicationId = this.route.snapshot.paramMap.get('id');
    if (applicationId) {
      this.loadApplication(applicationId);
    }
    this.getAllDropdownData();
    this.loanForm.get('riskLevel')?.valueChanges.subscribe(value => {
        this.onRiskLevelChange(value);
      });
  }

  getAllDropdownData() {
    this.getAllLenders();
    this.getAllUnderwriters();
    this.getAllRiskAnalysts();
    this.getAllComplianceOfficers();
    this.getAllManagers();
    this.getAllSeniorManagers();
  }

  loadApplication(id: string) {
    this.loanService.getLoanApplication(id).subscribe({
      next: (application: LoanApplicationDTO) => {
        if (application) {
          this.loanForm.patchValue(application);
          console.log(application);
        }
      },
      error: (error) => {
        console.error('Error loading application:', error);
        this.router.navigate(['/applications']);
      }
    });
  }

  onRiskLevelChange(value: string) {
    
    if (value === 'LOW') {
      this.loanForm.get('managerId')?.clearValidators();
      this.loanForm.get('seniorManagerId')?.clearValidators();
      this.loanForm.patchValue({
        managerId: '', 
        seniorManagerId: ''
      });
    } else if (value === 'MEDIUM') {
      this.loanForm.get('seniorManagerId')?.clearValidators();
      this.loanForm.patchValue({
        seniorManagerId: ''
      });
      this.loanForm.get('managerId')?.setValidators([Validators.required]);
    } else if (value === 'HIGH') {
      this.loanForm.get('managerId')?.setValidators([Validators.required]);
      this.loanForm.get('seniorManagerId')?.setValidators([Validators.required]);
    }
    this.loanForm.get('managerId')?.updateValueAndValidity();
    this.loanForm.get('seniorManagerId')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.loanForm.invalid) {
      return;
    }
  
    this.loanService.editLoanApplication(this.loanForm.value).subscribe(
      (response) => {
        if (response.success) {
          console.log(response.message);
          this.readOnlyFields = this.getReadOnlyFields();
          this.isSubmitted = true;
        } else {
          console.error(response.message);
        }
      },
      (error) => {
        console.error('Error updating loan application:', error);
      }
    );
  }

  getReadOnlyFields() {
    return [
      { label: 'Lender', value: this.getLenderName(this.loanForm.get('lenderId')?.value) },
      { label: 'Loan Amount', value: this.loanForm.get('loanAmount')?.value ? `$${this.loanForm.get('loanAmount')?.value.toLocaleString()}` : '' },
      { label: 'Loan Type', value: this.loanForm.get('loanType')?.value },
      { label: 'Risk Level', value: this.loanForm.get('riskLevel')?.value },
      { label: 'Is Active', value: this.loanForm.get('isActive')?.value ? 'Yes' : 'No' },
      { label: 'Underwriter', value: this.getUnderwriterName(this.loanForm.get('underwriterId')?.value) },
      { label: 'Risk Analyst', value: this.getRiskAnalystName(this.loanForm.get('riskAnalystId')?.value) },
      { label: 'Compliance Officer', value: this.getComplianceOfficerName(this.loanForm.get('complianceOfficerId')?.value) },
      { label: 'Manager', value: this.getManagerName(this.loanForm.get('managerId')?.value) },
      { label: 'Senior Manager', value: this.getSeniorManagerName(this.loanForm.get('seniorManagerId')?.value) }
    ];
  }
  
  get riskLevel() {
    return this.loanForm.get('riskLevel')?.value;
  }

  onDone() {
    this.router.navigate(['/applications']);
  }

  onCancel() {
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
  
}
