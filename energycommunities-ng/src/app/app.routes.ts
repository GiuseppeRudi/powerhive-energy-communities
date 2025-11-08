import { Routes } from '@angular/router';
import {Csv} from './components/csv/csv';
import { Welcome } from './components/welcome/welcome';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { MemberOverview } from './components/member-overview/member-overview';
import { HistoryComponent } from './components/hystory/hystory';
import { AnalysisComponent } from './components/analysis/analysis.component';
import {Analisys1} from './components/analisys1/analisys1';
import { AuthGuard } from './services/auth/auth.guard';

export const routes: Routes = [
  { path: '', component: Welcome },
  { path: 'login', component: Login },
  //protected routes
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
  { path: 'history', component: HistoryComponent, canActivate: [AuthGuard] },
  { path: 'member/:id', component: MemberOverview, canActivate: [AuthGuard] },
  { path: 'analysis', component: AnalysisComponent, canActivate: [AuthGuard] },
  { path: 'analysis1', component: Analisys1, canActivate: [AuthGuard] },
  { path: 'csv', component: Csv, canActivate: [AuthGuard] },
];
