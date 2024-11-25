import { Injectable, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LoanApplication, LoanApplicationDTO, LoanApplicationExtendedDTO, LoanStatus } from '../../../core/models/loan-application.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LenderDTO } from './lender.service';
import { ApiResponse } from '../../../core/models/auth.model';
import { User } from '../../../core/models/user.model';

export interface UserDTO {
  userId: string;
  fullName: string;
  email: string;
  username: string;
  lastLogin: string;
  roleId: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LoanService implements OnInit{
  
  private loanOfficerBaseUrl = 'http://localhost:8080/api/loan-officer';

  private loanApplicationBaseUrl = 'http://localhost:8080/api/loan_application';

  currentUser: User| null = null;

  constructor(private http: HttpClient) {}
  
  ngOnInit(): void {
    this.currentUser = this.getUserFromLocalStorage();  
  }
  
  private mockApplications: LoanApplication[] = [
    {
      id: 'LOAN001',
      applicantName: 'John Doe',
      applicantEmail: 'john@example.com',
      loanAmount: 250000,
      purpose: 'Home Purchase',
      status: LoanStatus.UNDER_REVIEW,
      assignedUnderwriter: 'Sarah Wilson',
      createdAt: new Date(),
      updatedAt: new Date(),
      documents: [],
      comments: []
    }
  ];

  private getUserFromLocalStorage(): User | null {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
  }

  getApplications(): Observable<LoanApplicationDTO[]> {
    return this.http.get<LoanApplicationDTO[]>(`${this.loanApplicationBaseUrl}/all_applications`);
  }

  getRecentApplications(): Observable<LoanApplicationDTO[]> {
    return this.http.get<LoanApplicationDTO[]>(`${this.loanApplicationBaseUrl}/recent_applications`);
  }

  getApplicationById(id: string): Observable<LoanApplication | undefined> {
    return of(this.mockApplications.find(app => app.id === id));
  }

  createApplication(application: Partial<LoanApplicationDTO>): Observable<LoanApplicationDTO> {
    const newApplication: LoanApplicationDTO = {
      lenderId: application.lenderId || '',
      loanAmount: application.loanAmount || '',
      loanType: application.loanType || '',
      riskLevel: application.riskLevel ? application.riskLevel.toUpperCase() : '',
      isActive: application.isActive || false,
      underwriterId: application.underwriterId || '',
      riskAnalystId: application.riskAnalystId || '',
      complianceOfficerId: application.complianceOfficerId || '',
      managerId: application.managerId || '',
      seniorManagerId: application.seniorManagerId || ''
    };
    
    return this.http.post<LoanApplicationDTO>(`${this.loanOfficerBaseUrl}/new_application`, newApplication);
  }
  
  editLoanApplication(application: LoanApplicationDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.loanOfficerBaseUrl}/edit_application`, application);
  }

  getLoanApplication(loanId: string): Observable<LoanApplicationDTO> {
    return this.http.get<LoanApplicationDTO>(`${this.loanOfficerBaseUrl}/loan_application/${loanId}`);
  }

  updateApplication(id: string, updates: Partial<LoanApplication>): Observable<LoanApplication> {
    const index = this.mockApplications.findIndex(app => app.id === id);
    if (index !== -1) {
      this.mockApplications[index] = {
        ...this.mockApplications[index],
        ...updates,
        updatedAt: new Date()
      };
      return of(this.mockApplications[index]);
    }
    throw new Error('Application not found');
  }

  getAllUnderwriters(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.loanApplicationBaseUrl}/all_underwriters`);
  }

  getAllRiskAnalysts(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.loanApplicationBaseUrl}/all_risk_analysts`);
  }

  getAllComplianceOfficers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.loanApplicationBaseUrl}/all_compliance_officers`);
  }

  getAllManagers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.loanApplicationBaseUrl}/all_managers`);
  }

  getAllSeniorManagers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.loanApplicationBaseUrl}/all_senior_managers`);
  }

  getLoanApplicationExtended(loanId: string): Observable<LoanApplicationExtendedDTO> {
    return this.http.get<LoanApplicationExtendedDTO>(`${this.loanApplicationBaseUrl}/loan_application_extended/${loanId}`);
  }

  getApplicationsForPendingFinalApproval(): Observable<LoanApplicationDTO[]> {
    return this.http.get<LoanApplicationDTO[]>(`${this.loanOfficerBaseUrl}/pending_final_approval_applications`);
  }

  finalApproveLoanApplication(loanId: string): Observable<ApiResponse> {
    const body = {};
    return this.http.put<ApiResponse>(`${this.loanOfficerBaseUrl}/loan_application/${loanId}/final_approval/approve`, body);
  }
  
  finalRejectLoanApplication(loanId: string): Observable<ApiResponse> {
    const body = {};
    return this.http.put<ApiResponse>(`${this.loanOfficerBaseUrl}/loan_application/${loanId}final_approval/reject`, body);
  }

  generateLoanReport(loanId: string): Observable<Blob> {
    const url = `${this.loanOfficerBaseUrl}/loan_application/${loanId}/generate_report`;
    const headers = new HttpHeaders({
      'Accept': 'application/pdf'
    });
    return this.http.get<Blob>(url, { headers, responseType: 'blob' as 'json' });
  }

  getApplicationsForPendingAssessment(): Observable<LoanApplicationDTO[]> {
    return this.http.get<LoanApplicationDTO[]>(`${this.loanApplicationBaseUrl}/pending_assessment`);
  }

  getApplicationsForPendingManagerAssessment(): Observable<LoanApplicationDTO[]> {
    return this.http.get<LoanApplicationDTO[]>(`${this.loanApplicationBaseUrl}/pending_manager_approval`);
  }

  getApplicationsForPendingSeniorManagerAssessment(): Observable<LoanApplicationDTO[]> {
    return this.http.get<LoanApplicationDTO[]>(`${this.loanApplicationBaseUrl}/pending_senior_manager_approval`);
  }

}