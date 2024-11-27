import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanApplicationDTO } from '../../../../core/models/loan-application.model';
import { LenderDTO, LenderService } from '../../services/lender.service';
import { UserDTO, LoanService } from '../../services/loan.service';

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

                <!-- Documents Section -->
                <div class="card mb-3">
                  <div class="card-header">
                    <h5>Previously Uploaded Loan Documents</h5>
                  </div>
                  <div class="card-body">
                    <div *ngIf="loanApplication !== null">
                      <div *ngFor="let document of loanApplication.loanDocuments">
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
                </div>
                
                <div class="mb-3">
                  <label class="form-label">Loan Documents</label>

                  <!-- Wrapper for all file uploads -->
                  <div class="file-upload-box p-3 border rounded shadow-sm">

                    <!-- Loan Application Form -->
                    <div class="mb-3">
                      <label class="form-label">Loan Application Form</label>
                      <input 
                        type="file" 
                        class="form-control" 
                        accept="application/pdf"
                        (change)="onFileChange($event, 'loanApplicationForm')"
                      />
                      <div *ngIf="loanForm.get('loanApplicationForm')?.invalid && loanForm.get('loanApplicationForm')?.touched" class="text-danger">
                        Loan Application Form is required.
                      </div>
                    </div>

                    <!-- Loan Agreement Document -->
                    <div class="mb-3">
                      <label class="form-label">Loan Agreement Document</label>
                      <input 
                        type="file" 
                        class="form-control" 
                        accept="application/pdf"
                        (change)="onFileChange($event, 'loanAgreementDocument')"
                      />
                      <div *ngIf="loanForm.get('loanAgreementDocument')?.invalid && loanForm.get('loanAgreementDocument')?.touched" class="text-danger">
                        Loan Agreement Document is required.
                      </div>
                    </div>

                    <!-- Income Verification Documents -->
                    <div class="mb-3">
                      <label class="form-label">Income Verification Documents</label>
                      <input 
                        type="file" 
                        class="form-control" 
                        accept="application/pdf"
                        (change)="onFileChange($event, 'incomeVerificationDocuments')"
                      />
                      <div *ngIf="loanForm.get('incomeVerificationDocuments')?.invalid && loanForm.get('incomeVerificationDocuments')?.touched" class="text-danger">
                        Income Verification Documents are required.
                      </div>
                    </div>

                    <!-- Compliance and Regulatory Documents -->
                    <div class="mb-3">
                      <label class="form-label">Compliance and Regulatory Documents</label>
                      <input 
                        type="file" 
                        class="form-control" 
                        accept="application/pdf"
                        (change)="onFileChange($event, 'complianceRegulatoryDocuments')"
                      />
                      <div *ngIf="loanForm.get('complianceRegulatoryDocuments')?.invalid && loanForm.get('complianceRegulatoryDocuments')?.touched" class="text-danger">
                        Compliance and Regulatory Documents are required.
                      </div>
                    </div>

                    <!-- Collateral Documents -->
                    <div class="mb-3">
                      <label class="form-label">Collateral Documents</label>
                      <input 
                        type="file" 
                        class="form-control" 
                        accept="application/pdf"
                        (change)="onFileChange($event, 'collateralDocuments')"
                      />
                      <div *ngIf="loanForm.get('collateralDocuments')?.invalid && loanForm.get('collateralDocuments')?.touched" class="text-danger">
                        Collateral Documents are required.
                      </div>
                    </div>
                    <div class="d-flex justify-content-center mb-3">
                      <button class="btn btn-secondary" (click)="clearFiles()">Clear</button>
                    </div>
                  </div>
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
                    
                    <div class="mb-3">
                      <label class="form-label">Loan Documents</label>
                      <div class="file-upload-box p-3 border rounded shadow-sm">

                        <div class="row mb-3">
                          <div class="col-md-4">
                            <label class="form-label">Loan Application Form</label>
                          </div>
                          <div class="col-md-8">
                            <div class="read-only-value">loanApplicationForm.pdf</div>
                          </div>
                        </div>

                        <div class="row mb-3">
                          <div class="col-md-4">
                            <label class="form-label">Loan Agreement Document</label>
                          </div>
                          <div class="col-md-8">
                            <div class="read-only-value">loanAgreementDocument.pdf</div>
                          </div>
                        </div>

                        <div class="row mb-3">
                          <div class="col-md-4">
                            <label class="form-label">Income Verification Document</label>
                          </div>
                          <div class="col-md-8">
                            <div class="read-only-value">incomeVerificationDocument.pdf</div>
                          </div>
                        </div>

                        <div class="row mb-3">
                          <div class="col-md-4">
                            <label class="form-label">Compliance & Regulatory Document</label>
                          </div>
                          <div class="col-md-8">
                            <div class="read-only-value">complianceRegulatoryDocument.pdf</div>
                          </div>
                        </div>

                        <div class="row mb-3">
                          <div class="col-md-4">
                            <label class="form-label">Collateral Document</label>
                          </div>
                          <div class="col-md-8">
                            <div class="read-only-value">collateralDocument.pdf</div>
                          </div>
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
  loanApplication: LoanApplicationDTO | null = null;

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
      seniorManagerId: ['', Validators.required],

      loanApplicationForm: [null],
      loanAgreementDocument: [null],
      incomeVerificationDocuments: [null],
      complianceRegulatoryDocuments: [null],
      collateralDocuments: [null]
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
          this.loanApplication = application;
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

  onFileChange(event: any, controlName: string) {
    const file = event.target.files[0];
    const formControl = this.loanForm.get(controlName);
    
    if (file) {
      formControl?.setValue(file);
      console.log(`${controlName} file selected:`, file);
    } else {
      formControl?.setValue(null);
    }
  }

  preparedFormData() {
    const formData = new FormData();
    const formValues = this.loanForm.value;
  
    formData.append('loanId', this.loanForm.value.loanId);
    formData.append('lenderId', this.loanForm.value.lenderId);
    formData.append('loanAmount', this.loanForm.value.loanAmount);
    formData.append('loanType', this.loanForm.value.loanType);
    formData.append('riskLevel', this.loanForm.value.riskLevel);
    formData.append('isActive', this.loanForm.value.isActive);
    formData.append('underwriterId', this.loanForm.value.underwriterId);
    formData.append('riskAnalystId', this.loanForm.value.riskAnalystId);
    formData.append('complianceOfficerId', this.loanForm.value.complianceOfficerId);
    formData.append('managerId', this.loanForm.value.managerId);
    formData.append('seniorManagerId', this.loanForm.value.seniorManagerId);
    formData.append('loanApplicationForm', formValues.loanApplicationForm === null ? '' : formValues.loanApplicationForm);
    formData.append('loanAgreementDocument', formValues.loanAgreementDocument === null ? '' : formValues.loanAgreementDocument);
    formData.append('incomeVerificationDocuments', formValues.incomeVerificationDocuments === null ? '' : formValues.incomeVerificationDocuments);
    formData.append('complianceRegulatoryDocuments', formValues.complianceRegulatoryDocuments === null ? '' : formValues.complianceRegulatoryDocuments);
    formData.append('collateralDocuments', formValues.collateralDocuments === null ? '' : formValues.collateralDocuments);
  
    return formData;
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.loanForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    const formData = this.preparedFormData();

    this.loanService.editLoanApplication(formData).subscribe(
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
  
  getFileDownloadLink(document: any): string {
    if (document.fileContent !== '') {
      return 'data:application/pdf;base64,'+ document.fileContent;
    }
    return '';
  }

  clearFiles() {
    this.loanForm.get('loanApplicationForm')?.setValue(null);
    this.loanForm.get('loanAgreementDocument')?.setValue(null);
    this.loanForm.get('incomeVerificationDocuments')?.setValue(null);
    this.loanForm.get('complianceRegulatoryDocuments')?.setValue(null);
    this.loanForm.get('collateralDocuments')?.setValue(null);
  }

}
