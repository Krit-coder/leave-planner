import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API = environment.apiUrl + '/auth'; // ✅ ADD THIS

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.API}/login`, {
      email,
      password
    }).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res));
      })
    );
  }

  logout() {
    localStorage.clear();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isManager(): boolean {
    return this.getUser().managerAccess === 1;
  }
  isGuest(): boolean {
    return localStorage.getItem('guest') === 'true';
  }
  enterGuestMode() {
    localStorage.setItem('guest', 'true');
  }

  exitGuestMode() {
    localStorage.clear();
  }
  loginAsGuest() {
    const guestUser = {
      name: 'Guest',
      role: 'VIEW_ONLY',
      managerAccess: 0,
      isGuest: true
    };

    localStorage.setItem('guest', 'true');
    localStorage.setItem('user', JSON.stringify(guestUser));
  }
}
