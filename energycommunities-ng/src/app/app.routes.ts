import { Routes } from '@angular/router';
import {Csv} from './components/csv/csv';
import { Welcome } from './components/welcome/welcome';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { MemberOverview } from './components/member-overview/member-overview';
import { HistoryComponent } from './components/history/history';
import { AnalysisComponent } from './components/analysis/analysis.component';
import {Analysis1} from './components/analysis1/analysis1';
import { AuthGuard } from './services/auth/auth.guard';
import {PlanManagement} from './components/plan-management/plan-management';

export const routes: Routes = [
  { path: '', component: Welcome },
  { path: 'login', component: Login },
  //protected routes
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
  { path: 'history', component: HistoryComponent, canActivate: [AuthGuard] },
  { path: 'member/:id', component: MemberOverview, canActivate: [AuthGuard] },
  { path: 'analysis', component: AnalysisComponent, canActivate: [AuthGuard] },
  { path: 'analysis1', component: Analysis1, canActivate: [AuthGuard] },
  { path: 'csv', component: Csv, canActivate: [AuthGuard] },
  { path: 'plan-management', component: PlanManagement}
];
