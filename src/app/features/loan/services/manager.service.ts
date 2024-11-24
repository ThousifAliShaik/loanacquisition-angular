import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoanApprovalDTO, UnderwriterAssessmentDTO } from "../../../core/models/loan-application.model";
import { ApiResponse } from "../../../core/models/auth.model";

@Injectable({
    providedIn: 'root'
  })
  export class ManagerService {
    
    private loanOfficerBaseUrl = 'http://localhost:8080/api/loan-officer';
  
    private loanApplicationBaseUrl = 'http://localhost:8080/api/loan_application';

    constructor(private http: HttpClient) {}

    submitManagerReview(reviewPayload: LoanApprovalDTO) {
      return this.http.post<LoanApprovalDTO>(`${this.loanApplicationBaseUrl}/submit_loan_approval`, reviewPayload);
    }
  }