import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CampaignsComponent } from './components/campaigns/campaigns.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { AudienceComponent } from './components/audience/audience.component';
import { MarketingDashboardComponent } from './components/marketing-dashboard/marketing-dashboard.component';
import { ContentCreatorDashboardComponent } from './components/content-creator-dashboard/content-creator-dashboard.component';
import { ExecutiveDashboardComponent } from './components/executive-dashboard/executive-dashboard.component';
import { ItSupportDashboardComponent } from './components/it-support-dashboard/it-support-dashboard.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login',  component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // Role-specific dashboards (standalone full-page, own sidebar)
  { path: 'dashboard/marketing',        component: MarketingDashboardComponent,       canActivate: [AuthGuard] },
  { path: 'dashboard/content-creator',  component: ContentCreatorDashboardComponent,  canActivate: [AuthGuard] },
  { path: 'dashboard/executive',        component: ExecutiveDashboardComponent,        canActivate: [AuthGuard] },
  { path: 'dashboard/it-support',       component: ItSupportDashboardComponent,        canActivate: [AuthGuard] },

  // App shell with shared sidebar (campaigns, analytics, audience, generic dashboard)
  {
    path: '', component: LayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: 'dashboard',  component: DashboardComponent },
      { path: 'campaigns',  component: CampaignsComponent },
      { path: 'analytics',  component: AnalyticsComponent },
      { path: 'audience',   component: AudienceComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
