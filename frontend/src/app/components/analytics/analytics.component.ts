import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  platforms: any[] = [];
  kpis: any[] = [];
  loading = true;
  error = '';
  activeTab = 'platforms';

  constructor(private svc: AnalyticsService) {}

  ngOnInit(): void {
    this.svc.getPlatformStats().subscribe({ next: (r) => { this.platforms = r.data; this.checkDone(); }, error: () => { this.error = 'Failed to load analytics.'; } });
    this.svc.getKpis().subscribe({ next: (r) => { this.kpis = r.data; this.checkDone(); }, error: () => { this.error = 'Failed to load KPIs.'; } });
  }

  private loaded = 0;
  checkDone(): void { if (++this.loaded >= 2) this.loading = false; }

  formatNumber(n: number): string {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return String(n ?? 0);
  }

  maxImpressions(): number {
    return Math.max(...this.platforms.map(p => p.total_impressions), 1);
  }
}
