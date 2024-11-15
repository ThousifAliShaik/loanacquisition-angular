import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LoanApplication, LoanApplicationDTO, LoanStatus } from '../../../core/models/loan-application.model';
import { HttpClient } from '@angular/common/http';
import { LenderDTO } from './lender.service';

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
export class LoanService {
  
  private loanOfficerBaseUrl = 'http://localhost:8080/api/loan-officer';

  private loanApplicationBaseUrl = 'http://localhost:8080/api/loan_application'

  constructor(private http: HttpClient) {}
  
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

  getApplications(): Observable<LoanApplicationDTO[]> {
    return this.http.get<LoanApplicationDTO[]>(`${this.loanOfficerBaseUrl}/all_applications`);
  }

  getRecentApplications(): Observable<LoanApplicationDTO[]> {
    return this.http.get<LoanApplicationDTO[]>(`${this.loanOfficerBaseUrl}/recent_applications`);
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
}