import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveApiService } from '../../services/leave-api.service';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-leave-planner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leave-planner.component.html',
  styleUrls: ['./leave-planner.component.scss']
})
export class LeavePlannerComponent implements OnInit {
  // original users
  users: User[] = [];

  // filtered users (used in UI)
  filteredUsers: User[] = [];

  // filter values
  selectedRole = 'ALL';
  selectedLocation = 'ALL';
  selectedModule = 'ALL';

  // dropdown options
  roles: string[] = [];
  locations: string[] = [];
  modules: string[] = [];
  loading = true;
  currentMonth!: number;
  currentYear!: number;
  daysInMonth: number[] = [];
  showFilters = false;
  leavesMap = new Map<string, string>();
  months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];
  years: number[] = [];
  // 🎉 Fixed holidays (YYYY-MM-DD)
  holidays: string[] = [
    '2025-01-26', // Republic Day
    '2025-03-29', // Holi
    '2025-04-14', // Ambedkar Jayanti
    '2025-08-15', // Independence Day
    '2025-10-02', // Gandhi Jayanti
    '2025-10-20', // Diwali (example)
    '2025-12-25',  // Christmas
    '2026-01-26', // Republic Day
    '2026-03-04', // Holi
  ];

  constructor(private api: LeaveApiService) { }

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
    this.loading = true;
    this.api.getUsers().subscribe((users: any[]) => {
      this.users = users;
      this.filteredUsers = users;
      this.buildFilters(users);
      this.loadLeaves();
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
  buildFilters(users: any[]) {
    this.roles = ['ALL', ...Array.from(new Set(users.map(u => u.role)))];
    this.locations = ['ALL', ...Array.from(new Set(users.map(u => u.location)))];
    this.modules = ['ALL', ...Array.from(new Set(users.map(u => u.module)))];
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
    const key = `${userId}_${date}`;
    const current = this.leavesMap.get(key);

    let nextType: string | null;

    switch (current) {
      case undefined:
        nextType = 'P';
        break;
      case 'P':
        nextType = 'U';
        break;
      case 'U':
        nextType = '1HF';
        break;
      case '1HF':
        nextType = '2HF';
        break;
      default:
        nextType = null;
    }

    this.api.saveLeave({
      userId,
      date,
      type: nextType
    }).subscribe({
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
        const date = l.leaveDate || l.date; // ✅ SAFETY
        const key = `${l.userId}_${date}`;
        this.leavesMap.set(key, l.type);
      });
      this.loading = false;
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
  isWeekend(day: number): boolean {
    const date = new Date(this.currentYear, this.currentMonth, day);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    return dayOfWeek === 0 || dayOfWeek === 6;
  }
  applyFilters() {
    this.filteredUsers = this.users.filter(u =>
      (this.selectedRole === 'ALL' || u.role === this.selectedRole) &&
      (this.selectedLocation === 'ALL' || u.location === this.selectedLocation) &&
      (this.selectedModule === 'ALL' || u.module === this.selectedModule)
    );
  }
  isHoliday(day: number): boolean {
    const dateStr = this.getDate(day); // already YYYY-MM-DD
    return this.holidays.includes(dateStr);
  }
  isDisabledDay(day: number): boolean {
    return this.isWeekend(day) || this.isHoliday(day);
  }
}
