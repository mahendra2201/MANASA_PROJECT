import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

Chart.register(...registerables);

@Component({
  selector: 'app-marketing-dashboard',
  templateUrl: './marketing-dashboard.component.html',
  styleUrls: ['./marketing-dashboard.component.scss']
})
export class MarketingDashboardComponent implements AfterViewInit, OnDestroy {
  user: User | null;
  today = new Date();
  sidebarOpen = false;
  activeSection = 'overview';
  private charts: Chart[] = [];
  private chartsInitialized = new Set<string>();

  constructor(private auth: AuthService) {
    this.user = this.auth.getCurrentUser();
  }

  get initials(): string {
    if (!this.user?.full_name) return 'U';
    return this.user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  setSection(s: string): void {
    this.activeSection = s;
    this.sidebarOpen = false;
    setTimeout(() => this.initSectionCharts(s), 50);
  }

  toggleSidebar(): void { this.sidebarOpen = !this.sidebarOpen; }
  closeSidebar(): void { this.sidebarOpen = false; }
  logout(): void { this.auth.logout(); }

  ngAfterViewInit(): void {
    // default section 'overview' has no charts
  }

  private initSectionCharts(section: string): void {
    if (section === 'trends' && !this.chartsInitialized.has('trends')) {
      this.chartsInitialized.add('trends');
      this.initTrendsCharts();
    }
  }

  private initTrendsCharts(): void {
    const lineEl = document.getElementById('mkt-lineChart') as HTMLCanvasElement;
    if (lineEl) {
      this.charts.push(new Chart(lineEl, {
        type: 'line',
        data: {
          labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Engagement',
            data: [8300, 21300, 8400, 16100, 43600, 11500, 3700],
            borderColor: '#6c63ff', backgroundColor: 'rgba(108,99,255,0.12)',
            tension: 0.4, fill: true, pointBackgroundColor: '#6c63ff',
            pointRadius: 4, pointHoverRadius: 7, borderWidth: 2.5
          }, {
            label: 'Reach',
            data: [222000, 430000, 193000, 352000, 835000, 221000, 83000],
            borderColor: '#00d4aa', backgroundColor: 'rgba(0,212,170,0.06)',
            tension: 0.4, fill: true, pointBackgroundColor: '#00d4aa',
            pointRadius: 4, pointHoverRadius: 7, borderWidth: 2, yAxisID: 'y1'
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: '#ffffff08' }, ticks: { color: '#8b90b0', font: { size: 11 } } },
            y: { grid: { color: '#ffffff08' }, ticks: { color: '#8b90b0', font: { size: 11 } } },
            y1: { display: false, position: 'right' }
          }
        }
      }));
    }

    const pieEl = document.getElementById('mkt-pieChart') as HTMLCanvasElement;
    if (pieEl) {
      this.charts.push(new Chart(pieEl, {
        type: 'doughnut',
        data: {
          labels: ['Instagram', 'Twitter', 'Facebook', 'LinkedIn'],
          datasets: [{ data: [38, 28, 22, 12], backgroundColor: ['#6c63ff', '#ff6b9d', '#00d4aa', '#ffaa00'], borderWidth: 0, hoverOffset: 6 }]
        },
        options: { responsive: false, cutout: '68%', plugins: { legend: { display: false } } }
      }));
    }
  }

  ngOnDestroy(): void { this.charts.forEach(c => c.destroy()); }
}
