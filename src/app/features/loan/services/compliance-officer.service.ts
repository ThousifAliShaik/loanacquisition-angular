import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ComplianceAssessmentDTO, RiskAssessmentDTO, UnderwriterAssessmentDTO } from "../../../core/models/loan-application.model";
import { ApiResponse } from "../../../core/models/auth.model";

@Injectable({
    providedIn: 'root'
  })
  export class ComplianceOfficerService {
    
    private loanOfficerBaseUrl = 'http://localhost:8080/api/loan-officer';
  
    private loanApplicationBaseUrl = 'http://localhost:8080/api/loan_application';

    constructor(private http: HttpClient) {}

    submitComplianceOfficerReview(reviewPayload: ComplianceAssessmentDTO) {
      return this.http.post<ComplianceAssessmentDTO>(`${this.loanApplicationBaseUrl}/submit_compliance_assessment`, reviewPayload);
    }
  }