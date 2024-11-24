import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RiskAssessmentDTO, UnderwriterAssessmentDTO } from "../../../core/models/loan-application.model";
import { ApiResponse } from "../../../core/models/auth.model";

@Injectable({
    providedIn: 'root'
  })
  export class RiskAnalystService {
    
    private loanOfficerBaseUrl = 'http://localhost:8080/api/loan-officer';
  
    private loanApplicationBaseUrl = 'http://localhost:8080/api/loan_application';

    constructor(private http: HttpClient) {}

    submitRiskAnalystReview(reviewPayload: RiskAssessmentDTO) {
      return this.http.post<RiskAssessmentDTO>(`${this.loanApplicationBaseUrl}/submit_risk_assessment`, reviewPayload);
    }
  }