import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

Chart.register(...registerables);

@Component({
  selector: 'app-executive-dashboard',
  templateUrl: './executive-dashboard.component.html',
  styleUrls: ['./executive-dashboard.component.scss']
})
export class ExecutiveDashboardComponent implements AfterViewInit, OnDestroy {
  user: User | null;
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
    // Initialize charts for the default 'overview' section
    setTimeout(() => this.initSectionCharts('overview'), 50);
  }

  private initSectionCharts(section: string): void {
    if (section === 'overview' && !this.chartsInitialized.has('overview')) {
      this.chartsInitialized.add('overview');
      this.initOverviewChart();
    }
    if (section === 'reports' && !this.chartsInitialized.has('reports')) {
      this.chartsInitialized.add('reports');
      this.initReportsChart();
    }
  }

  private initOverviewChart(): void {
    const lEl = document.getElementById('exec-lineChart') as HTMLCanvasElement;
    if (lEl) {
      this.charts.push(new Chart(lEl, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Total Reach',
            data: [80000, 95000, 110000, 88000, 102000, 222000, 430000, 193000, 352000, 835000, 221000, 83000],
            borderColor: '#c9a84c', backgroundColor: 'rgba(201,168,76,0.08)',
            tension: .4, fill: true, pointRadius: 3, pointBackgroundColor: '#c9a84c', borderWidth: 2
          }, {
            label: 'Engagement',
            data: [3200, 4100, 4800, 3600, 5200, 8300, 21600, 8400, 16100, 43000, 11500, 3700],
            borderColor: '#00b4a6', backgroundColor: 'rgba(0,180,166,0.05)',
            tension: .4, fill: true, pointRadius: 3, pointBackgroundColor: '#00b4a6', borderWidth: 1.5, yAxisID: 'y1'
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: '#6b7080', font: { size: 10 }, boxWidth: 8, padding: 12 } } },
          scales: {
            x: { grid: { color: '#ffffff06' }, ticks: { color: '#6b7080', font: { size: 10 } } },
            y: { grid: { color: '#ffffff06' }, ticks: { color: '#6b7080', font: { size: 10 } } },
            y1: { display: false }
          }
        }
      }));
    }
  }

  private initReportsChart(): void {
    const bEl = document.getElementById('exec-budgetBar') as HTMLCanvasElement;
    if (bEl) {
      this.charts.push(new Chart(bEl, {
        type: 'bar',
        data: {
          labels: ['FB', 'TW', 'IG', 'LI'],
          datasets: [
            { label: 'Budget (₹K)', data: [9.5, 11, 21.5, 13.5], backgroundColor: '#c9a84c55', borderRadius: 4 },
            { label: 'Reach (100K)', data: [2.48, 5.80, 8.35, 1.75], backgroundColor: '#00b4a655', borderRadius: 4 }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#6b7080', font: { size: 10 } } },
            y: { grid: { color: '#ffffff06' }, ticks: { color: '#6b7080', font: { size: 10 } } }
          }
        }
      }));
    }
  }

  ngOnDestroy(): void { this.charts.forEach(c => c.destroy()); }
}
