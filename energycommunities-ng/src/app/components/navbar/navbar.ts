import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {User} from '../../model/User';
import {NgIf} from '@angular/common';


@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  standalone: true
})
export class Navbar implements OnInit {

  currentUser : User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(){

    this.authService.user$.subscribe(user => this.currentUser = user);

  }

}
