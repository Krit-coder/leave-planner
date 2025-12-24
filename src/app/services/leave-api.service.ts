import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LeaveApiService {

  // private baseUrl = 'http://localhost:8080/api';
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
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
