import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LenderDTO {
    lenderId: string;
    lenderName: string;
    lenderType: string;
    registrationNumber: string;
    dateJoined: string;
    isActive: boolean;
    riskScore: number;
    email: string;
    address: string;
    websiteUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class LenderService {
  private apiUrl = 'http://localhost:8080/api/loan_application/all_lenders'; // Adjust the URL as needed

  constructor(private http: HttpClient) {}

  getAllLenders(): Observable<LenderDTO[]> {
    return this.http.get<LenderDTO[]>(this.apiUrl);
  }
}
