import { Routes } from '@angular/router';
import { Welcome } from './welcome/welcome';
import { Login } from './login/login';
import {Dashboard} from './dashboard/dashboard';
import {MemberOverview} from './member-overview/member-overview';

export const routes: Routes = [
  { path: '', component: Welcome },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'member/:id', component: MemberOverview }
];
