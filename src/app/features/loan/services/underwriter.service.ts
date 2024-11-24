import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UnderwriterAssessmentDTO } from "../../../core/models/loan-application.model";
import { ApiResponse } from "../../../core/models/auth.model";

@Injectable({
    providedIn: 'root'
  })
  export class UnderwriterService {
    
    private loanOfficerBaseUrl = 'http://localhost:8080/api/loan-officer';
  
    private loanApplicationBaseUrl = 'http://localhost:8080/api/loan_application';

    constructor(private http: HttpClient) {}

    submitUnderwriterReview(reviewPayload: UnderwriterAssessmentDTO) {
      return this.http.post<UnderwriterAssessmentDTO>(`${this.loanApplicationBaseUrl}/submit_underwriter_assessment`, reviewPayload);
    }
  }