import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  user: User | null;
  currentRoute = '';
  sidebarOpen = true;
  mobileSidebarOpen = false;

  get navItems() {
    return [
      { path: this.auth.getDashboardRoute(this.user?.role), label: 'Dashboard', icon: 'grid' },
      { path: '/campaigns', label: 'Campaigns',  icon: 'target' },
      { path: '/analytics', label: 'Analytics',  icon: 'bar-chart' },
      { path: '/audience',  label: 'Audience',   icon: 'users' }
    ];
  }

  constructor(private auth: AuthService, private router: Router) {
    this.user = this.auth.getCurrentUser();
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.currentRoute = e.urlAfterRedirects;
      // Auto-close mobile sidebar on navigation
      this.mobileSidebarOpen = false;
    });
  }

  logout(): void { this.auth.logout(); }

  toggleSidebar(): void {
    if (this.isMobile()) {
      this.mobileSidebarOpen = !this.mobileSidebarOpen;
    } else {
      this.sidebarOpen = !this.sidebarOpen;
    }
  }

  openMobileSidebar(): void { this.mobileSidebarOpen = true; }
  closeMobileSidebar(): void { this.mobileSidebarOpen = false; }

  onNavItemClick(): void {
    if (this.isMobile()) {
      this.mobileSidebarOpen = false;
    }
  }

  @HostListener('window:keydown.escape')
  onEscape(): void { this.mobileSidebarOpen = false; }

  isMobile(): boolean { return window.innerWidth <= 768; }

  getInitials(): string {
    if (!this.user?.full_name) return 'U';
    return this.user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
