import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-audience',
  templateUrl: './audience.component.html',
  styleUrls: ['./audience.component.scss']
})
export class AudienceComponent implements OnInit {
  data: any = null;
  loading = true;
  error = '';

  constructor(private svc: AnalyticsService) {}

  ngOnInit(): void {
    this.svc.getAudienceInsights().subscribe({
      next: (r) => { this.data = r.data; this.loading = false; },
      error: () => { this.error = 'Failed to load audience insights.'; this.loading = false; }
    });
  }

  maxEngagement(arr: any[]): number {
    return Math.max(...arr.map((x: any) => x.total_engagement), 1);
  }

  formatNumber(n: number): string {
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return String(n ?? 0);
  }
}
