import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    LayoutComponent,
    DashboardComponent,
    CampaignsComponent,
    AnalyticsComponent,
    AudienceComponent,
    MarketingDashboardComponent,
    ContentCreatorDashboardComponent,
    ExecutiveDashboardComponent,
    ItSupportDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
