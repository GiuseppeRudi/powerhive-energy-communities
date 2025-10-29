import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Navbar} from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
  `,
  standalone: true,
  styleUrl: 'components/welcome/welcome.css'
})
export class App {
  protected readonly title = signal('energycommunities-ng');
}
