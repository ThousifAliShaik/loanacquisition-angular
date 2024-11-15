import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User, UserRole } from '../models/user.model';
import { ApiResponse, JwtAuthenticationResponse, LoginRequest, SignUpRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  private uuidToNumber(uuid: string): number {
    let hash = 0;
    for (let i = 0; i < uuid.length; i++) {
      const char = uuid.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  mapRoleToEnum(role: string): UserRole {
    switch (role) {
      case 'ADMIN':
        return UserRole.ADMIN;
      case 'LOAN_OFFICER':
        return UserRole.LOAN_OFFICER;
      case 'UNDERWRITER':
        return UserRole.UNDERWRITER;
      case 'RISK_ANALYST':
        return UserRole.RISK_ANALYST;
      case 'COMPLIANCE_OFFICER':
        return UserRole.COMPLIANCE_OFFICER;
      case 'MANAGER':
        return UserRole.MANAGER;
      case 'SENIOR_MANAGER':
        return UserRole.SENIOR_MANAGER;
      default:
        return UserRole.LOAN_OFFICER;
    }
  }

  login(loginRequest: LoginRequest): Observable<User> {
    return this.http.post<JwtAuthenticationResponse>(
      `${this.baseUrl}/signin`,
      loginRequest
    ).pipe(
      map(response => {
        const user: User = {
          id: this.uuidToNumber(response.userId),
          username: loginRequest.username,
          token: response.accessToken,
          role: this.mapRoleToEnum(response.role),
          isActive: true,
          email: ''
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return throwError(() => 'Invalid username or password');
        }
        return throwError(() => 'An error occurred during login. Please try again.');
      })
    );
  }

  logout(): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/logout`, {}).pipe(
      map(response => {
        // Remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        return response;
      })
    );
  }

  register(registerData: SignUpRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/signup`,
      registerData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred during registration';
        
        if (error.error && typeof error.error === 'object' && 'message' in error.error) {
          errorMessage = error.error.message;
        } else if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        return throwError(() => errorMessage);
      })
    );
  }
}