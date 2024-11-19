import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { User, UserRole } from './core/models/user.model';
import { NotificationDropdownComponent } from './shared/components/notification-dropdown.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    NgbModule,
    NotificationDropdownComponent
  ],
  template: `
    <div class="app-container">
      <!-- Navbar, Only show if currentUser exists -->
      <nav class="navbar navbar-expand-lg navbar-light bg-light" *ngIf="currentUser">
        <div class="container">
          <a class="navbar-brand" href="#">LAMS</a>
          <div class="d-flex align-items-center">
            <app-notification-dropdown class="me-3"></app-notification-dropdown>
            <a routerLink="/logout" class="btn btn-outline-light">Logout</a>
          </div>
        </div>
      </nav>

      <!-- Main Layout -->
      <div class="main-layout">
        <!-- Sidebar Menu, Only show if currentUser exists -->
        <div class="sidebar" *ngIf="currentUser">
          <!-- Show spinner while menu is loading -->
          <div *ngIf="menuLoading" class="sidebar-spinner">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <!-- Show menu items once they are loaded -->
          <div *ngIf="!menuLoading && menuItems.length > 0">
            <div class="list-group">
              <a *ngFor="let item of menuItems" [routerLink]="item.route" 
                 class="list-group-item list-group-item-action" 
                 [class.active]="item.route === currentRoute">
                <i [class]="item.icon"></i> {{ item.label }}
              </a>
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="content" [ngClass]="{'content-logged-out': !currentUser}">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.navbar {
  z-index: 1000;  /* Ensure the navbar is always on top */
}

.main-layout {
  display: flex;
  height: calc(100vh - 56px); /* Adjust for navbar height */
}

.sidebar {
  margin-top: 20px;
  width: 250px;
  /* background-color: #f8f9fa; */
  padding-top: 20px;
  /* border-right: 1px solid #ddd; */
  position: fixed;
  height: 100%;
  top: 56px; /* Adjust for navbar height */
  left: 0;
  
}

.content {
  flex: 1;
  margin-left: 250px;  /* Ensure this matches the sidebar width */
  padding: 20px;
  transition: margin-left 0.3s ease;
}

.content-logged-out {
  margin-left: 0; /* Remove margin-left when logged out */
  padding: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

/* Ensure no overflow on body or html */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

/* Ensure the list-group in sidebar takes up full width */
.sidebar .list-group {
  width: 100%;
  padding-left: 0;  /* Remove any default padding on the list */
  margin-bottom: 0;  /* Remove any bottom margin if unnecessary */
}

.list-group-item {
  cursor: pointer;
}

.list-group-item.active {
  background-color: #007bff;
  color: white;
}

  `]
})
export class AppComponent implements OnInit {
  currentUser: User | null = null;
  menuItems: any[] = [];
  currentRoute = '/';
  userRole: UserRole | null = null; // Allow userRole to be null initially
  menuLoading = true;  // Track if the menu is still loading

  userRoles = UserRole;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Check if the user is stored in localStorage (on page reload)
    this.currentUser = this.getUserFromLocalStorage();
    if (this.currentUser) {
      this.userRole = this.currentUser.role;
      this.setMenuItems();
      this.menuLoading = false;
    }

    // Subscribe to currentUser observable and set menu items once the user is available
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.userRole = user ? user.role : null; // Handle null case explicitly
      this.setMenuItems();
      this.menuLoading = false;  // Stop spinner after menu is loaded
    });
  }

  private getUserFromLocalStorage(): User | null {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
  }

  private setMenuItems() {
    // Set the menu items based on the user role
    if (this.userRole === null) {
      this.menuItems = []; // No menu if the role is null
      return;
    }

    switch (this.userRole) {
      case UserRole.ADMIN:
        this.menuItems = [
          { label: 'Dashboard', route: '/', icon: 'bi bi-speedometer2' },
          { label: 'User Management', route: '/admin/users', icon: 'bi bi-person' },
          // Add other admin-specific menu items
        ];
        break;
      case UserRole.LOAN_OFFICER:
        this.menuItems = [
          { label: 'Dashboard', route: '/', icon: 'bi bi-speedometer2' },
          { label: 'Applications', route: 'applications', icon: 'bi bi-clipboard-check'},
          { label: 'Review Applications', route: 'review/applications', icon: 'bi bi-file-earmark-check'}
          // Add other user-specific menu items
        ];
        break;
      default:
        this.menuItems = [];
    }
  }
}

