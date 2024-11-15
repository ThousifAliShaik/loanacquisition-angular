import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";

@Component({
    selector: 'app-logout',
    template: '<p>Logging out...</p>',
    standalone: true
  })
  export class LogoutComponent implements OnInit {
    constructor(
      private authService: AuthService,
      private router: Router
    ) {}
  
    ngOnInit() {
      this.authService.logout().subscribe({
        next: () => {
          console.log('Logout successful');
          this.router.navigate(['/login']);
        },
        error: error => {
          console.error('Logout error', error);
          this.router.navigate(['/login']);
        }
      });
    }
  }