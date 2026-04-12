import { Component, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

Chart.register(...registerables);

@Component({
  selector: 'app-content-creator-dashboard',
  templateUrl: './content-creator-dashboard.component.html',
  styleUrls: ['./content-creator-dashboard.component.scss']
})
export class ContentCreatorDashboardComponent implements OnDestroy {
  user: User | null;
  sidebarOpen = false;
  activeSection = 'dashboard';
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

  private initSectionCharts(section: string): void {
    if (section === 'trends' && !this.chartsInitialized.has('trends')) {
      this.chartsInitialized.add('trends');
      this.initTrendsCharts();
    }
    if (section === 'demographics' && !this.chartsInitialized.has('demographics')) {
      this.chartsInitialized.add('demographics');
      this.initDemographicsCharts();
    }
  }

  private initTrendsCharts(): void {
    const tEl = document.getElementById('cc-trendChart') as HTMLCanvasElement;
    if (tEl) {
      this.charts.push(new Chart(tEl, {
        type: 'bar',
        data: {
          labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            { label: 'Likes', data: [13100, 21600, 8300, 16100, 43000, 11500, 3700], backgroundColor: '#7c3aed88', borderRadius: 6 },
            { label: 'Comments', data: [1580, 3090, 1470, 3000, 6900, 1740, 620], backgroundColor: '#ff5c3588', borderRadius: 6 },
            { label: 'Shares', data: [2690, 7100, 3280, 6400, 13200, 3400, 1400], backgroundColor: '#d9770688', borderRadius: 6 }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: '#888580', font: { size: 11 }, boxWidth: 10, padding: 14 } } },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#888580', font: { size: 11 } } },
            y: { grid: { color: '#e8e4dd' }, ticks: { color: '#888580', font: { size: 11 } } }
          }
        }
      }));
    }
  }

  private initDemographicsCharts(): void {
    const gEl = document.getElementById('cc-genderChart') as HTMLCanvasElement;
    if (gEl) {
      this.charts.push(new Chart(gEl, {
        type: 'doughnut',
        data: {
          labels: ['Female', 'Male'],
          datasets: [{ data: [58, 42], backgroundColor: ['#7c3aed', '#ff5c35'], borderWidth: 0, hoverOffset: 5 }]
        },
        options: {
          responsive: false, cutout: '70%',
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (c: any) => ` ${c.label}: ${c.parsed}%` } }
          }
        }
      }));
    }
  }

  ngOnDestroy(): void { this.charts.forEach(c => c.destroy()); }
}
