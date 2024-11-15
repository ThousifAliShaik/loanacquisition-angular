import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { User, UserProfile, UserRole, RoleDTO } from '../../../core/models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiResponse } from '../../../core/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private baseUrl = 'http://localhost:8080/api/admin';
  
  constructor(private http: HttpClient) {}
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }),
    withCredentials: true
  };

  getUsers(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(`${this.baseUrl}/all_users`, this.httpOptions).pipe(
      catchError(error => {
        console.error('Error fetching users:', error);
        return throwError(() => new Error('Failed to fetch users'));
      })
    );
  }

  getUserById(id: string): Observable<UserProfile | undefined> {
    return this.http.get<UserProfile>(`${this.baseUrl}/user/${id}`, this.httpOptions).pipe(
      catchError(error => {
        console.error('Error fetching user by ID:', error);
        return throwError(() => new Error('Failed to fetch user'));
      })
    );
  }

  createUser(user: Omit<UserProfile, 'userId' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse> {
    const userProfileDTO: UserProfile = {
        userId: undefined,
        username: user.username || '',
        email: user.email,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        role: {
            roleId: user.role.roleId,
            roleName: user.role.roleName
        },
        isActive: user.isActive
    };

    return this.http.post<ApiResponse>(`${this.baseUrl}/new_user`, userProfileDTO, this.httpOptions).pipe(
        catchError(error => {
            let errorMessage = 'An unexpected error occurred.';
            if (error.status === 400) {
                errorMessage = error.error?.message || 'Failed to create user';
            }
            console.error('Error creating user:', errorMessage);
            return throwError(() => new Error(errorMessage));
        })
    );
}

  
updateUser(id: string, updates: Partial<UserProfile>): Observable<ApiResponse> {
  return this.http.put<ApiResponse>(
    `${this.baseUrl}/update_user`, 
    { ...updates, userId: id }, 
    this.httpOptions
  ).pipe(
    catchError(error => {
      console.error('Error updating user:', error);
      return throwError(() => new Error('Failed to update user'));
    })
  );
}


  toggleUserStatus(username: string, action: 'disable_user' | 'enable_user'): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(
      `${this.baseUrl}/${action}`, 
      null, 
      { 
        ...this.httpOptions,
        params: { username } 
      }
    ).pipe(
      catchError(error => {
        console.error(`Error ${action.replace('_', 'ing ')} user:`, error);
        return throwError(() => new Error(`Failed to ${action.replace('_', ' ')}`));
      })
    );
  }

  getRoles(): Observable<RoleDTO[]> {
    return this.http.get<RoleDTO[]>(`${this.baseUrl}/all_roles`, this.httpOptions).pipe(
      catchError(error => {
        console.error('Error fetching roles:', error);
        return throwError(() => new Error('Failed to fetch roles'));
      })
    );
  }
}
