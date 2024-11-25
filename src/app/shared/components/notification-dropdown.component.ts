import { Component, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NotificationService, NotificationDTO } from '../../core/services/notification.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-notification-dropdown',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dropdown">
      <button class="btn btn-link position-relative" type="button" (click)="toggleDropdown()">
        <i class="bi bi-bell text-white fs-5"></i>
        <span class="notification-badge" *ngIf="unreadCount > 0">
          {{ unreadCount }}
        </span>
      </button>

      <div class="dropdown-menu notification-dropdown" [class.show]="isOpen">
        <div class="dropdown-header d-flex justify-content-between align-items-center">
          <h6 class="mb-0">Notifications</h6>
        </div>
        <div class="notification-list">
          <a *ngFor="let notification of notifications"
             [routerLink]="getNotificationLink(notification)"
             class="dropdown-item notification-item"
             [class.unread]="!notification.isRead"
             (click)="markAllAsRead()">
            <div class="d-flex align-items-center">
              <i [class]="getNotificationIcon(notification.notificationType)"></i>
              <div class="ms-3">
                <p class="mb-1">{{ notification.message }}</p>
                <small class="text-muted">
                  {{ notification.createdAt | date:'short' }}
                </small>
              </div>
            </div>
          </a>
          <div class="dropdown-item text-center" *ngIf="notifications.length === 0">
            No notifications
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notification-dropdown {
      right: 0;
      left: auto;
      transform: translateX(-10px);
      width: 500px;
      max-height: 400px;
      overflow-y: auto;
    }
    .notification-item {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #e9ecef;
      white-space: normal;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
    .notification-item:last-child {
      border-bottom: none;
    }
    .notification-item.unread {
      background-color: #f8f9fa;
    }
    .notification-item:hover {
      background-color: #f1f3f5;
    }
    .notification-list {
      max-width: 100%;
    }
  `]
})
export class NotificationDropdownComponent implements OnInit {
  notifications: NotificationDTO[] = [];
  unreadCount = 0;
  isOpen = false;
  currentUser: User | null = null;

  constructor(
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.notificationService.getNotifications().subscribe(
      notifications => this.notifications = notifications
    );
    this.notificationService.getUnreadCount().subscribe(
      count => this.unreadCount = count
    );
    this.currentUser = this.getUserFromLocalStorage();
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if(this.isOpen) {
      this.markAllAsRead();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.el.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isOpen = false;
    }
  }

  markAsRead(notification: NotificationDTO, event: Event) {
    event.preventDefault();
    
    this.notificationService.markAsRead(notification.notificationId);
  }

  getNotificationLink(notification: NotificationDTO): string[] {
    const loanId = notification.loanId;
    switch (this.currentUser?.role) {
      case 'LOAN_OFFICER':
        return [`/applications/${loanId}/final-review`];
      case 'UNDERWRITER':
        return [`/applications/${loanId}/underwriter-assessment`];
      case 'RISK_ANALYST':
        return [`/applications/${loanId}/risk-assessment`];
      case 'COMPLIANCE_OFFICER':
        return [`/applications/${loanId}/compliance-assessment`];
      case 'MANAGER':
        return [`/applications/${loanId}/manager-assessment`];
      case 'SENIOR_MANAGER':
        return [`/applications/${loanId}/senior-manager-assessment`];
      default:
        return [];
    }
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead();
    this.unreadCount = 0;

  }

  getNotificationIcon(type: string): string {
    const icons = {
      info: 'bi bi-info-circle text-primary',
      success: 'bi bi-check-circle text-success',
      warning: 'bi bi-exclamation-triangle text-warning',
      error: 'bi bi-x-circle text-danger'
    };
    return icons[type as keyof typeof icons] || icons.info;
  }

  private getUserFromLocalStorage(): User | null {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
  }
}
