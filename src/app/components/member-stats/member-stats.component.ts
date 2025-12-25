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
    });
  }

  getTotalLeaves(userId: number): number {
    return this.leaves.filter(l => +l.userId === +userId).length;
  }
}
