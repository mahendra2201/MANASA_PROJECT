import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, LoginPayload, RegisterPayload, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, payload).pipe(
      tap(res => {
        if (res.success) this.saveSession(res);
      })
    );
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, payload).pipe(
      tap(res => {
        if (res.success) this.saveSession(res);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('mp_token');
    localStorage.removeItem('mp_user');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('mp_token');
  }

  getToken(): string | null {
    return localStorage.getItem('mp_token');
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem('mp_user');
    return user ? JSON.parse(user) : null;
  }

  private saveSession(res: AuthResponse): void {
    localStorage.setItem('mp_token', res.token);
    localStorage.setItem('mp_user', JSON.stringify(res.user));
  }
}
