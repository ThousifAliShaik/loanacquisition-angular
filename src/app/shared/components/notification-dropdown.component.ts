import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationService, NotificationDTO } from '../../core/services/notification.service';

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
          <button class="btn btn-link btn-sm" (click)="markAllAsRead()">
            Mark all as read
          </button>
        </div>
        <div class="notification-list">
          <a *ngFor="let notification of notifications"
             [routerLink]="notification.link"
             class="dropdown-item notification-item"
             [class.unread]="!notification.isRead"
             (click)="markAsRead(notification)">
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
      max-width: 100%; /* Prevent the notification list from exceeding the dropdown width */
    }
  `]
})
export class NotificationDropdownComponent implements OnInit {
  notifications: NotificationDTO[] = [];
  unreadCount = 0;
  isOpen = false;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.getNotifications().subscribe(
      notifications => this.notifications = notifications
    );
    this.notificationService.getUnreadCount().subscribe(
      count => this.unreadCount = count
    );
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  markAsRead(notification: NotificationDTO) {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.notificationId);
    }
    this.isOpen = false;
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead();
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
}