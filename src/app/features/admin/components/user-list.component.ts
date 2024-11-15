import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserManagementService } from '../services/user-management.service';
import { User, UserProfile, UserRole } from '../../../core/models/user.model';
import { ApiResponse } from '../../../core/models/auth.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>User Management</h2>
        <button class="btn btn-primary" routerLink="/admin/users/new">
          <i class="bi bi-person-plus"></i> Add User
        </button>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let user of users">
                  <td>{{ user.username }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span class="badge bg-info">{{ user.role.roleName }}</span>
                  </td>
                  <td>
                    <span [class]="'badge ' + (user.isActive ? 'bg-success' : 'bg-danger')">
                      {{ user.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-primary me-2" 
                            [routerLink]="['/admin/users', user.userId]">
                      Edit
                    </button>
                    <button class="btn btn-sm" 
                          [class.btn-danger]="user.isActive"
                          [class.btn-success]="!user.isActive"
                          (click)="toggleUserStatus(user)"
                          [disabled]="!user.username">
                    {{ user.isActive ? 'Disable' : 'Enable' }}
                  </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
    <div *ngIf="notificationMessage" [ngClass]="{'success-popup': isSuccess, 'error-popup': !isSuccess}" class="notification-popup">
      {{ notificationMessage }}
    </div>

  `
})
export class UserListComponent implements OnInit {
  users: UserProfile[] = [];
  notificationMessage: string | null = null;
  isSuccess: boolean = false;

  constructor(private userManagementService: UserManagementService, private router: Router) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userManagementService.getUsers().subscribe(
      users => this.users = users
    );
  }

  toggleUserStatus(user: UserProfile) {
    const action = user.isActive ? 'disable_user' : 'enable_user'; // Determine action based on current status

    this.userManagementService.toggleUserStatus(user.username, action).subscribe({
      next: (response: ApiResponse) => {
        if (response.success) {
          // Toggle the user's local status based on the current state
          const index = this.users.findIndex(u => u.username === user.username);
          if (index !== -1) {
            this.users[index].isActive = !this.users[index].isActive; // Toggle the status
          }
          // Show success notification
          this.notificationMessage = response.message;
          this.isSuccess = true; // Green popup
        } else {
          console.error('Unexpected response:', response);
          this.notificationMessage = response.message || 'An unexpected error occurred.';
          this.isSuccess = false; // Red popup
        }
        this.hideNotificationAfterDelay();
        
        // Add a delay before reloading the page
        
      },
      error: (error) => {
        console.error('Error toggling user status:', error);
        this.notificationMessage = error.message || 'Failed to toggle user status!';
        this.isSuccess = false; // Red popup
        this.hideNotificationAfterDelay();
      }
    });
}


  hideNotificationAfterDelay() {
    setTimeout(() => {
      this.notificationMessage = null;
    }, 3000);
  }
}
