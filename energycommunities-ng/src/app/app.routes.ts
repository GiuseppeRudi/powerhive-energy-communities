import { Routes } from '@angular/router';
import { Welcome } from './components/welcome/welcome';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { MemberOverview } from './components/member-overview/member-overview';

export const routes: Routes = [
  { path: '', component: Welcome },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'member/:id', component: MemberOverview }
];
