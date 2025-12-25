import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { MyLeavesComponent } from './components/my-leaves/my-leaves.component';
import { LeavePlannerComponent } from './components/leave-planner/leave-planner.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth.service';
import { MemberStatsComponent } from './components/member-stats/member-stats.component';
// import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    // MyLeavesComponent,
    LeavePlannerComponent,
    // HttpClientModule,
    DashboardComponent,
    MemberStatsComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  currentView: 'dashboard' | 'calendar' | 'member-stats' = 'dashboard';
  constructor(public auth: AuthService) { }
}
