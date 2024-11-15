import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard-metrics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="row custom-row">
      <div class="col-md custom-col mb-4" *ngFor="let metric of metrics">
        <div class="card h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-subtitle mb-2 text-muted">{{ metric.label }}</h6>
                <h2 class="card-title mb-0">{{ metric.value }}</h2>
              </div>
              <i [class]="metric.icon + ' fs-1 text-primary opacity-25'"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .custom-row {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }

      .custom-col {
        flex: 1 0 19%; /* Each column will take up about 19% of the row */
        margin-right: 10px; /* Optional: add some spacing between tiles */
      }

      .card {
        height: 100%;
      }

      .card-body {
        padding: 1rem;
      }

      .card-title {
        font-size: 1.5rem;
      }

      .card-subtitle {
        font-size: 1rem;
      }


    `
  ]
})
export class DashboardMetricsComponent implements OnInit {
  metrics: any[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getDashboardMetrics().subscribe(
      metrics => {
        this.metrics = metrics;
      },
      error => {
        console.error('Error fetching metrics:', error);
      }
    );
  }
}
