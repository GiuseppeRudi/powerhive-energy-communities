import { Routes } from '@angular/router';
import { Welcome } from './components/welcome/welcome';
import { Login } from './components/login/login';
import {Dashboard} from './components/dashboard/dashboard';

export const routes: Routes = [
  { path: '', component: Welcome },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard }
];
