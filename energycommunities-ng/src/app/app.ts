import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
  standalone: true,
  styleUrl: 'welcome/welcome.css'
})
export class App {
  protected readonly title = signal('energycommunities-ng');
}
