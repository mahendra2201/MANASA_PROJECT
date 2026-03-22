import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  data: any = null;
  loading = true;
  error = '';

  constructor(private dashSvc: DashboardService) {}

  ngOnInit(): void {
    this.dashSvc.getSummary().subscribe({
      next: (res) => { this.data = res.data; this.loading = false; },
      error: () => { this.error = 'Failed to load dashboard data.'; this.loading = false; }
    });
  }

  formatNumber(n: number): string {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return String(n);
  }
}
