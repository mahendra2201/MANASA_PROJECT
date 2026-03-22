import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private api = environment.apiUrl;
  constructor(private http: HttpClient) {}
  getKpis(): Observable<any> { return this.http.get(`${this.api}/analytics/kpis`); }
  getPlatformStats(): Observable<any> { return this.http.get(`${this.api}/analytics/platforms`); }
  getAudienceInsights(): Observable<any> { return this.http.get(`${this.api}/audience/insights`); }
}
