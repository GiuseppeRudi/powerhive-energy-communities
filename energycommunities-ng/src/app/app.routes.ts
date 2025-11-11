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
import {Analysis2} from './components/analysis2/analysis2';
import {PlanManagement} from './components/plan-management/plan-management';
import {ChooseAnalysis3} from './components/choose-analysis3/choose-analysis3';
import {Analysis3} from './components/analysis3/analysis3';
import {ChooseAnalysis2} from './components/choose-analysis2/choose-analysis2';

export const routes: Routes = [
  { path: '', component: Welcome },
  { path: 'login', component: Login },
  //protected routes
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
  { path: 'history', component: HistoryComponent, canActivate: [AuthGuard] },
  { path: 'member/:id', component: MemberOverview, canActivate: [AuthGuard] },
  { path: 'analysis', component: AnalysisComponent, canActivate: [AuthGuard] },
  { path: 'analysis1', component: Analysis1, canActivate: [AuthGuard] },
  { path: 'analysis2', component: Analysis2, canActivate: [AuthGuard] },
  { path: 'choose-analysis2', component: ChooseAnalysis2, canActivate: [AuthGuard] },
  { path: 'choose-analysis3', component: ChooseAnalysis3, canActivate: [AuthGuard] },
  { path: 'analysis3', component: Analysis3, canActivate: [AuthGuard] },
  { path: 'csv', component: Csv, canActivate: [AuthGuard] },
  { path: 'plan-management', component: PlanManagement}
];
