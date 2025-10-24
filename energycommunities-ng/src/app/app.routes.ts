import { Routes } from '@angular/router';
import { Welcome } from './welcome/welcome';
import { Login } from './login/login';

export const routes: Routes = [
  { path: '', component: Welcome },
  { path: 'login', component: Login }
];
