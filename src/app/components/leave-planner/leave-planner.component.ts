import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveService, Leave } from '../../services/leave.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-leave-planner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leave-planner.component.html',
  styleUrls: ['./leave-planner.component.scss']
})
export class LeavePlannerComponent {

  months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  years: number[] = [];
  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();
  days: number[] = [];

  // For reason input modal
  showReasonModal = false;
  selectedLeave: Leave | null = null;
  reasonText = '';

  constructor(public leaveService: LeaveService, public auth: AuthService) {
    this.initYears();
    this.generateDays();
  }

  initYears() {
    for (let y = this.year - 2; y <= this.year + 2; y++) this.years.push(y);
  }

  generateDays() {
    const totalDays = new Date(this.year, this.month, 0).getDate();
    this.days = Array.from({ length: totalDays }, (_, i) => i + 1);
  }

  onMonthYearChange() {
    this.generateDays();
  }

  getDate(day: number): string {
    return `${this.year}-${String(this.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  toggleLeave(userId: string, date: string) {
  // Only allow self-edit if not manager
  if (!this.auth.isManager() && userId !== this.auth.currentUser.id) return;

  const existing = this.leaveService.getLeave(userId, date);

  if (!existing) {
    this.leaveService.saveLeave({ userId, date, type: 'PLANNED' });
    return;
  }

  if (existing.type === 'PLANNED') {
    this.leaveService.saveLeave({ ...existing, type: 'UNPLANNED' });
    return;
  }

  // Unplanned → remove
  this.leaveService.removeLeave(userId, date);
}


  // saveLeave() {
  //   if (this.selectedLeave) {
  //     this.leaveService.saveLeave({ ...this.selectedLeave, reason: this.reasonText });
  //     this.selectedLeave = null;
  //     this.showReasonModal = false;
  //   }
  // }

  // cancelReason() {
  //   this.selectedLeave = null;
  //   this.showReasonModal = false;
  // }

  getLeaveType(userId: string, day: number) {
    return this.leaveService.getLeave(userId, this.getDate(day))?.type;
  }
}
