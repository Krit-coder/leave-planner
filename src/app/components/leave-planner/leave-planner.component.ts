import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveApiService } from '../../services/leave-api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-leave-planner',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './leave-planner.component.html',
  styleUrls: ['./leave-planner.component.scss']
})
export class LeavePlannerComponent implements OnInit {

  users: any[] = [];

  currentMonth!: number;
  currentYear!: number;
  daysInMonth: number[] = [];
  leavesMap = new Map<string, string>(); 
  months = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
  ];
  years: number[] = [];

  constructor(private api: LeaveApiService) {}

  ngOnInit() {
  const today = new Date();

  // ✅ Set current month & year by default
  this.currentMonth = today.getMonth(); // 0-based
  this.currentYear = today.getFullYear();

  // Build year dropdown
  this.years = [];
  for (let i = this.currentYear - 2; i <= this.currentYear + 2; i++) {
    this.years.push(i);
  }

  // Load calendar & data
  this.generateCalendar();
  this.loadUsers();
  this.loadLeaves();
}

  /* ---------- USERS ---------- */
  loadUsers() {
    this.api.getUsers().subscribe({
      next: res => this.users = res,
      error: err => console.error('Error loading users', err)
    });
  }

  /* ---------- CALENDAR ---------- */
  generateCalendar() {
    const totalDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    this.daysInMonth = Array.from({ length: totalDays }, (_, i) => i + 1);
  }

  changeMonth(step: number) {
  this.currentMonth += step;

  if (this.currentMonth > 11) {
    this.currentMonth = 0;
    this.currentYear++;
  }

  if (this.currentMonth < 0) {
    this.currentMonth = 11;
    this.currentYear--;
  }

  this.generateCalendar();
  this.loadLeaves();
}


  getDate(day: number): string {
    const m = this.currentMonth + 1;
    return `${this.currentYear}-${m.toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')}`;
  }

  /* ---------- LEAVE TOGGLE ---------- */
  toggleLeave(userId: number, day: number) {
  const date = this.getDate(day);

  this.api.saveLeave({ userId, date }).subscribe({
    next: () => this.loadLeaves(),
    error: err => console.error(err)
  });
}

  loadLeaves() {
  const start = this.getDate(1);
  const end = this.getDate(this.daysInMonth.length);

  this.api.getLeaves(start, end).subscribe(res => {
    this.leavesMap.clear();
    res.forEach(l => {
      const key = `${l.userId}_${l.leaveDate}`;
      this.leavesMap.set(key, l.type);
    });
  });
}
getDayName(day: number): string {
  return new Date(this.currentYear, this.currentMonth, day)
    .toLocaleDateString('en-US', { weekday: 'short' });
}
onMonthYearChange() {
  this.generateCalendar();
  this.loadLeaves();
}

}
