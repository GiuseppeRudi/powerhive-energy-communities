import { Routes } from '@angular/router';
import {Csv} from './components/csv/csv';
import { Welcome } from './components/welcome/welcome';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { MemberOverview } from './components/member-overview/member-overview';
import {Analisys1} from './components/analisys1/analisys1';

export const routes: Routes = [
  { path: '', component: Welcome },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'member/:id', component: MemberOverview },
  { path: 'analysis1', component: Analisys1 },
  { path: 'csv', component: Csv}
];
