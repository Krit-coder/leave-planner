import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { MyLeavesComponent } from './components/my-leaves/my-leaves.component';
import { LeavePlannerComponent } from './components/leave-planner/leave-planner.component';
import { ManagerDashboardComponent } from './components/manager-dashboard/manager-dashboard.component';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    // MyLeavesComponent,
    LeavePlannerComponent,
    HttpClientModule,
    ManagerDashboardComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(public auth: AuthService) {}
}
