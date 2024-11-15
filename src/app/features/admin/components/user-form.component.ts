import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserManagementService } from '../services/user-management.service';
import { RoleDTO, UserProfile } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid">
      <div class="card">
        <div class="card-header">
          <h3>{{ isEditMode ? 'Edit User' : 'Add New User' }}</h3>
        </div>
        <div class="card-body">
          <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
            <div class="mb-3">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-control" formControlName="fullName" [ngClass]="{'is-invalid': submitted && f['fullName'].errors}">
              <div class="invalid-feedback" *ngIf="submitted && f['fullName'].errors">
                <span *ngIf="f['fullName'].errors['required']">Full Name is required.</span>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Email</label>
              <input 
                type="email" 
                class="form-control" 
                formControlName="email" 
                [ngClass]="{'is-invalid': submitted && f['email'].errors}"
                [attr.readonly]="isEditMode ? true : null"
                [disabled]="isEditMode"
              >
              <div class="invalid-feedback" *ngIf="submitted && f['email'].errors">
                <span *ngIf="f['email'].errors['required']">Email is required.</span>
                <span *ngIf="f['email'].errors['email']">Please enter a valid email address.</span>
              </div>
            </div>


            <div class="mb-3">
              <label class="form-label">Phone Number</label>
              <input type="text" class="form-control" formControlName="phoneNumber" [ngClass]="{'is-invalid': submitted && f['phoneNumber'].errors}">
              <div class="invalid-feedback" *ngIf="submitted && f['phoneNumber'].errors">
                <span *ngIf="f['phoneNumber'].errors['required']">Phone Number is required.</span>
                <span *ngIf="f['phoneNumber'].errors['pattern']">Phone Number must be 10 digits.</span>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">User Role</label>
              <select class="form-select" formControlName="role" [ngClass]="{'is-invalid': submitted && f['role'].errors}">
                <option value="">Select role</option>
                <option *ngFor="let role of roles" [ngValue]="role">
                  {{ role.roleName }}
                </option>
              </select>
              <div class="invalid-feedback" *ngIf="submitted && f['role'].errors">
                <span *ngIf="f['role'].errors['required']">Role is required.</span>
              </div>
            </div>

            <div class="d-flex justify-content-center align-items-center mb-3">
              <ng-container *ngIf="!isFormReadOnly; else backButtonTemplate">
                <button type="submit" class="btn btn-primary me-2">
                  {{ isEditMode ? 'Update' : 'Create' }} User
                </button>
                <button type="button" class="btn btn-secondary" (click)="onCancel()">
                  Cancel
                </button>
              </ng-container>
              <ng-template #backButtonTemplate>
                <button type="button" class="btn btn-secondary" (click)="onCancel()">
                  Back
                </button>
              </ng-template>
            </div>
          </form>
        </div>
      </div>

      <!-- Popup Notification -->
      <div *ngIf="notificationMessage" [ngClass]="{'success-popup': isSuccess, 'error-popup': !isSuccess}" class="notification-popup">
        {{ notificationMessage }}
      </div>
    </div>
  `,
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  submitted = false;
  isEditMode = false;
  roles: RoleDTO[] = [];
  isFormReadOnly = false;
  notificationMessage: string | null = null;
  isSuccess: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userManagementService: UserManagementService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.formBuilder.group({
      fullName: [{ value: '', disabled: this.isFormReadOnly }, Validators.required],
      email: [{ value: '', disabled: this.isFormReadOnly }, [Validators.required, Validators.email, this.customEmailValidator]],
      phoneNumber: [{ value: '', disabled: this.isFormReadOnly }, [Validators.required, Validators.pattern(/^\d{10}$/)]],
      role: [{ value: null, disabled: this.isFormReadOnly }, Validators.required]
    });
  }

  ngOnInit() {
    this.loadRoles().then(() => {
        const userId = this.route.snapshot.paramMap.get('id');
        if (userId) {
            this.isEditMode = true;
            this.loadUser(userId);
        }
    });
  }

  loadRoles(): Promise<void> {
    return new Promise((resolve, reject) => {
        this.userManagementService.getRoles().subscribe(
            (roles: RoleDTO[]) => {
                this.roles = roles;
                resolve();
            },
            error => {
                console.error('Error loading roles:', error);
                reject(error);
            }
        );
    });
  }

  loadUser(id: string) {
    this.userManagementService.getUserById(id).subscribe({
      next: (user) => {
        if (user) {
          // Set the form values with the user data
          this.userForm.patchValue({
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: this.roles.find(role => role.roleId === user.role.roleId)
          });
        } else {
          console.error('User not found');
          this.router.navigate(['/admin/users']);
        }
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.router.navigate(['/admin/users']);
      }
    });
  }

  customEmailValidator(control: AbstractControl) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(control.value) ? null : { invalidEmail: true };
  }

  get f() { return this.userForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.userForm.invalid) {
      return;
    }

    const userData = this.userForm.value;
    const userId = this.route.snapshot.paramMap.get('id');
    const userProfile: Omit<UserProfile, 'createdAt' | 'updatedAt'> = {
      username: userData.username || '',
      fullName: userData.fullName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      role: {
        roleId: userData.role.roleId,
        roleName: userData.role.roleName
      },
      isActive: userData.isActive || true
    };

    if (this.isEditMode) {
      if (!userId) {
        console.error('User ID is null. Cannot update user.');
        this.notificationMessage = 'User ID is required for updating.';
        this.isSuccess = false;
        return;
      }
      userProfile.userId = userId;
      this.userManagementService.updateUser(userId, userProfile).subscribe({
        next: (response) => {
          this.handleResponse(response);
        },
        error: (error) => {
          this.notificationMessage = error.message || 'Updating user failed!';
          this.isSuccess = false;
          this.hideNotificationAfterDelay();
        }
      });
    } else {
      this.userManagementService.createUser(userProfile).subscribe({
        next: (response) => {
          this.handleResponse(response);
        },
        error: (error) => {
          this.notificationMessage = error.message || 'Creating user failed!';
          this.isSuccess = false;
          this.hideNotificationAfterDelay();
        }
      });
    }
  }

  handleResponse(response: any) {
    if (response.success) {
      this.notificationMessage = response.message;
      this.isSuccess = true;
    } else {
      this.notificationMessage = response.message;
      this.isSuccess = false;
    }
    this.setFormReadOnly(true);
    this.hideNotificationAfterDelay();
  }

  setFormReadOnly(readOnly: boolean) {
    this.isFormReadOnly = readOnly;
    Object.keys(this.userForm.controls).forEach((controlName) => {
      const control = this.userForm.get(controlName);
      readOnly ? control?.disable() : control?.enable();
    });
  }

  hideNotificationAfterDelay() {
    setTimeout(() => {
      this.notificationMessage = null;
    }, 3000);
  }

  onCancel() {
    this.router.navigate(['/admin/users']);
  }
}
