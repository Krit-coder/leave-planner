import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveApiService } from '../../services/leave-api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  users: any[] = [];
  leaves: any[] = [];

  todayLeaves: any[] = [];
  nextWeekLeaves: any[] = [];
  nextMonthLeaves: any[] = [];

  constructor(private api: LeaveApiService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.getUsers().subscribe(users => {
      this.users = users;
      this.loadLeaves();
    });
  }

  loadLeaves() {
    const today = new Date();
    const start = this.formatDate(today);

    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30);
    const end = this.formatDate(nextMonth);

    this.api.getLeaves(start, end).subscribe(leaves => {
      this.leaves = leaves;
      this.processLeaves();
    });
  }

  processLeaves() {
    const todayStr = this.formatDate(new Date());

    this.todayLeaves = this.leaves.filter(l => l.leaveDate === todayStr);

    this.nextWeekLeaves = this.leaves.filter(l =>
      this.isWithinDays(l.leaveDate, 7)
    );

    this.nextMonthLeaves = this.leaves.filter(l =>
      this.isWithinDays(l.leaveDate, 30)
    );
  }

  isWithinDays(dateStr: string, days: number): boolean {
    const d = new Date(dateStr);
    const today = new Date();
    const diff =
      (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= days;
  }

  formatDate(d: Date): string {
    return d.toISOString().split('T')[0];
  }

  getUserName(userId: number): string {
    return this.users.find(u => +u.id === +userId)?.name || 'Unknown';
  }

  getTotalLeaves(userId: number): number {
    return this.leaves.filter(l => +l.userId === +userId).length;
  }
}
