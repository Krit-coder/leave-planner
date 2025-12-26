import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LeavePlannerComponent } from './components/leave-planner/leave-planner.component';
import { MemberStatsComponent } from './components/member-stats/member-stats.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },

    {
        path: '',
        canActivate: [AuthGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'leave-planner', component: LeavePlannerComponent },
            { path: 'member-stats', component: MemberStatsComponent },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },

    { path: '**', redirectTo: 'dashboard' }
];
