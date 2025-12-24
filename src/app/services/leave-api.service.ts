import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LeaveApiService {

  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users`);
  }

  saveLeave(payload: { userId: number; date: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/leaves`, payload);
  }

  getLeaves(startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/leaves?startDate=${startDate}&endDate=${endDate}`
    );
  }
}
