import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: '../welcome/welcome.css',
  standalone: true
})
export class Login {

}
