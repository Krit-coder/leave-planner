import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LeaveApiService {
  private usersCache: any[] | null = null;
  // private baseUrl = 'http://localhost:8080/api';
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    if (this.usersCache) {
      return of(this.usersCache);
    }
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      tap(users => this.usersCache = users)
    );
  }

  saveLeave(payload: { userId: number; date: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/leaves`, payload);
  }

  getLeaves(startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/leaves?startDate=${startDate}&endDate=${endDate}`
    );
  }
}
