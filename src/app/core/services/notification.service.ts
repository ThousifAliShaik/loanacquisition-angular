import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface NotificationDTO {
  notificationId: string;
  message: string;
  notificationType: 'LOAN_APPLICATION_UPDATE' | 'RISK_ASSESSMENT' | 'APPROVAL_STATUS' | 'DOCUMENT_SUBMISSION' | 'GENERAL';
  isRead: boolean;
  createdAt: Date;
  link?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private baseUrl = 'http://localhost:8080/api/notifications';

  private notifications = new BehaviorSubject<NotificationDTO[]>([]);
  private unreadCount = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {
    
    // Mock initial NotificationDTOs
    this.addNotification({
      notificationId: '12',
      message: 'New loan application requires review',
      notificationType: 'LOAN_APPLICATION_UPDATE',
      createdAt: new Date(),
      isRead: false,
      link: '/applications/LOAN001/review'
    });
  }

  getNotifications(): Observable<NotificationDTO[]> {
    return this.http.get<NotificationDTO[]>(`${this.baseUrl}/all_notifications`);
  }

  getUnreadCount(): Observable<number> {
    return this.unreadCount;
  }

  addNotification(NotificationDTO: Omit<NotificationDTO, 'id'>) {
    const newNotificationDTO = {
      ...NotificationDTO,
      id: Date.now().toString()
    };

    const current = this.notifications.value;
    this.notifications.next([newNotificationDTO, ...current]);
    this.updateUnreadCount();
  }

  markAsRead(id: string) {
    const updated = this.notifications.value.map(notification =>
      notification.notificationId === id ? { ...notification, read: true } : notification
    );
    this.notifications.next(updated);
    this.updateUnreadCount();
  }

  markAllAsRead() {
    const updated = this.notifications.value.map(notification => ({
      ...notification,
      read: true
    }));
    this.notifications.next(updated);
    this.updateUnreadCount();
  }

  private updateUnreadCount() {
    const count = this.notifications.value.filter(n => !n.isRead).length;
    this.unreadCount.next(count);
  }
}