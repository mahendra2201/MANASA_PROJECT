import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

Chart.register(...registerables);

@Component({
  selector: 'app-it-support-dashboard',
  templateUrl: './it-support-dashboard.component.html',
  styleUrls: ['./it-support-dashboard.component.scss']
})
export class ItSupportDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  user: User | null;
  now = new Date();
  sidebarOpen = false;
  activeSection = 'overview';
  private charts: Chart[] = [];
  private chartsInitialized = new Set<string>();
  private clockTimer: any;

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

  ngOnInit(): void {
    this.clockTimer = setInterval(() => { this.now = new Date(); }, 1000);
  }

  ngAfterViewInit(): void {
    // default section 'overview' has no charts
  }

  private initSectionCharts(section: string): void {
    if (section === 'api' && !this.chartsInitialized.has('api')) {
      this.chartsInitialized.add('api');
      this.initApiChart();
    }
    if (section === 'privacy' && !this.chartsInitialized.has('privacy')) {
      this.chartsInitialized.add('privacy');
      this.initUptimeChart();
    }
  }

  private initApiChart(): void {
    const aEl = document.getElementById('it-apiChart') as HTMLCanvasElement;
    if (aEl) {
      this.charts.push(new Chart(aEl, {
        type: 'line',
        data: {
          labels: ['00:00', '04:00', '08:00', '09:10', '09:20', '09:30', '09:42'],
          datasets: [
            { label: 'Facebook', data: [130, 125, 140, 142, 138, 140, 142], borderColor: '#4267B2', tension: .4, pointRadius: 2, borderWidth: 1.5, fill: false },
            { label: 'Twitter', data: [180, 175, 195, 198, 190, 195, 198], borderColor: '#1DA1F2', tension: .4, pointRadius: 2, borderWidth: 1.5, fill: false },
            { label: 'Instagram', data: [210, 220, 240, 487, 460, 480, 487], borderColor: '#ffd32a', tension: .4, pointRadius: 2, borderWidth: 1.5, fill: false },
            { label: 'LinkedIn', data: [220, 215, 230, 231, 228, 230, 231], borderColor: '#0077B5', tension: .4, pointRadius: 2, borderWidth: 1.5, fill: false }
          ]
        } as any,
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: '#4d6275', font: { size: 9 }, boxWidth: 8, padding: 10 } } },
          scales: {
            x: { grid: { color: '#1e2d3d' }, ticks: { color: '#4d6275', font: { size: 8 } } },
            y: {
              grid: { color: '#1e2d3d' }, ticks: { color: '#4d6275', font: { size: 8 } },
              title: { display: true, text: 'ms', color: '#4d6275', font: { size: 9 } }
            }
          }
        }
      }));
    }
  }

  private initUptimeChart(): void {
    const uEl = document.getElementById('it-uptimeChart') as HTMLCanvasElement;
    if (uEl) {
      this.charts.push(new Chart(uEl, {
        type: 'bar',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Uptime %',
            data: [100, 99.9, 100, 99.7, 100, 99.8, 99.7],
            backgroundColor: ['#00ff8840', '#00ff8840', '#00ff8840', '#ffd32a40', '#00ff8840', '#00ff8840', '#ffd32a40'],
            borderColor: ['#00ff88', '#00ff88', '#00ff88', '#ffd32a', '#00ff88', '#00ff88', '#ffd32a'],
            borderWidth: 1.5, borderRadius: 4
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#4d6275', font: { size: 9 } } },
            y: { min: 99.5, max: 100.1, grid: { color: '#1e2d3d' }, ticks: { color: '#4d6275', font: { size: 9 } } }
          }
        }
      }));
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.clockTimer);
    this.charts.forEach(c => c.destroy());
  }
}
