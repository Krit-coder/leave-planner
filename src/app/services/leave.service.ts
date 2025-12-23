import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Leave {
  userId: string;
  date: string;
  type: 'PLANNED' | 'UNPLANNED';
}

export interface User {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  users: User[] = [];
  private leaves: Leave[] = [];

  constructor(private http: HttpClient) {
    this.loadUsers();
  }

  // Load team members from JSON
  loadUsers() {
    this.http.get<User[]>('assets/team.json').subscribe(data => {
      this.users = data;
    });
  }

  getMyLeaves(userId: string): Leave[] {
    return this.leaves.filter(l => l.userId === userId);
  }

  getLeave(userId: string, date: string): Leave | undefined {
    return this.leaves.find(l => l.userId === userId && l.date === date);
  }

  saveLeave(leave: Leave) {
    const index = this.leaves.findIndex(
      l => l.userId === leave.userId && l.date === leave.date
    );
    if (index >= 0) this.leaves[index] = leave;
    else this.leaves.push(leave);
  }

  removeLeave(userId: string, date: string) {
    this.leaves = this.leaves.filter(l => !(l.userId === userId && l.date === date));
  }

  getAllLeaves(): Leave[] {
    return this.leaves;
  }
}
