import { Component } from '@angular/core';
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

  navItems = [
    { path: '/dashboard', label: 'Dashboard',  icon: 'grid' },
    { path: '/campaigns', label: 'Campaigns',  icon: 'target' },
    { path: '/analytics', label: 'Analytics',  icon: 'bar-chart' },
    { path: '/audience',  label: 'Audience',   icon: 'users' }
  ];

  constructor(private auth: AuthService, private router: Router) {
    this.user = this.auth.getCurrentUser();
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.currentRoute = e.urlAfterRedirects;
    });
  }

  logout(): void { this.auth.logout(); }
  toggleSidebar(): void { this.sidebarOpen = !this.sidebarOpen; }

  getInitials(): string {
    if (!this.user?.full_name) return 'U';
    return this.user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
