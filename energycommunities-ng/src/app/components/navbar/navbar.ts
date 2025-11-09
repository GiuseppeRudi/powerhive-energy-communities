import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
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

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(){

    this.authService.user$.subscribe(user => this.currentUser = user);

  }

  logout() {
    this.authService.logout(); // cancella sessione e stato utente
    this.router.navigate(['/login']); // reindirizza alla pagina di login
  }


}
