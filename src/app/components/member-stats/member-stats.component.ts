import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveApiService } from '../../services/leave-api.service';

@Component({
  selector: 'app-member-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './member-stats.component.html',
  styleUrls: ['./member-stats.component.scss']
})
export class MemberStatsComponent implements OnInit {

  users: any[] = [];
  leaves: any[] = [];
  loading = true;

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
    // Load wide range so totals are correct
    this.api.getLeaves('2024-01-01', '2026-12-31').subscribe(leaves => {
      this.leaves = leaves;
      this.loading = false;
    });
  }

  // ✅ FINAL LOGIC
  getTotalLeaves(userId: number): number {
    return this.leaves
      .filter(l => +l.userId === +userId)
      .reduce((total, l) => {
        switch (l.type) {
          case '1HF':
          case '2HF':
            return total + 0.5;
          case 'P':
          case 'U':
            return total + 1;
          default:
            return total;
        }
      }, 0);
  }




  // (Optional but useful)
  getPlannedLeaves(userId: number): number {
    return this.leaves.filter(
      l => +l.userId === +userId && l.type === 'P'
    ).length;
  }

  getUnplannedLeaves(userId: number): number {
    return this.leaves.filter(
      l => +l.userId === +userId && l.type === 'U'
    ).length;
  }

  getHalfDayLeaves(userId: number): number {
    return this.leaves.filter(
      l =>
        +l.userId === +userId &&
        (l.type === '1HF' || l.type === '2HF')
    ).length * 1;
  }
}
