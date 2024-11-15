import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { AdminDashboardMetrics, LoanOfficerDashboardMetrics } from '../../../core/models/common.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private adminBaseUrl = 'http://localhost:8080/api/admin';
  private loanOfficerBaseUrl = 'http://localhost:8080/api/loan-officer';

  public metrics: LoanOfficerDashboardMetrics | null = null;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }),
    withCredentials: true
  };
  
  constructor(private http: HttpClient) {}

  getAdminMetrics(): Observable<AdminDashboardMetrics> {
    return this.http.get<AdminDashboardMetrics>(`${this.adminBaseUrl}/dashboard_metrics`, this.httpOptions).pipe(
      catchError(error => {
        console.error('Error fetching dashboard metrics:', error);
        return throwError(() => new Error('Failed to fetch metrics'));
      })
    );
  }

  getDashboardMetrics(): Observable<any[]> {
    return this.http.get<LoanOfficerDashboardMetrics>(`${this.loanOfficerBaseUrl}/dashboard_metrics`, this.httpOptions).pipe(
      catchError(error => {
        console.error('Error fetching loan officer metrics:', error);
        return throwError(() => new Error('Failed to fetch metrics'));
      }),
      map((data: LoanOfficerDashboardMetrics) => {
        return [
          {
            label: 'Total Applications',
            value: data?.totalApplications,
            icon: 'bi bi-file-text'
          },
          {
            label: 'Under Review',
            value: data?.applicationsUnderReview,
            icon: 'bi bi-hourglass-split'
          },
          {
            label: 'Approved',
            value: data?.applicationsApproved,
            icon: 'bi bi-check-circle'
          },
          {
            label: 'Rejected',
            value: data?.applicationsRejected,
            icon: 'bi bi-x-circle'
          },
          {
            label: 'Assigned to You',
            value: data?.applicationsPendingFinalApproval,
            icon: 'bi bi-person'
          }
        ];
      })
    );
  }

}