import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {AuthService} from '../../services/auth/auth.service';
import {User} from '../../model/User';
import {Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    CommonModule,
  ],
  templateUrl: './login.html',
  styleUrls: ['../welcome/welcome.css', 'login.css'],
  standalone: true
})
export class Login {

  currentUser : User | null = null;
  //state of page
  showRegister : boolean = false;

  // login
  username: string = '';
  password: string = '';

  // register
  regUsername : string = '';
  regEmail : string = '';
  regPassword : string = '';
  regFirstName : string = '';
  regLastName : string = '';

  errorMessage: string | null = null;
  loginError: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  onLogin() {
    this.authService.login(this.username, this.password).subscribe({
      next: (user) => {
        this.errorMessage = null;
        this.loginError = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login fallito', err);
        this.errorMessage = 'Incorrect username or password, retry';
        this.loginError = true;
      }
    });
  }

  registerError: boolean = false;
  registerErrorMessage: string | null = null;

  onRegister(){
    const registrationDto ={
      username: this.regUsername,
      password: this.regPassword,
      firstName : this.regFirstName,
      lastName : this.regLastName,
      email : this.regEmail,
    };

    this.authService.register(registrationDto).subscribe({
      next: result => {
        alert('Registration successful! You can now log in.');
        this.showRegister = false;
        this.regUsername = '';
        this.regEmail = '';
        this.regPassword = '';
        this.regFirstName = '';
        this.regLastName = '';

        this.registerError = false;
        this.registerErrorMessage = null;
      },
      error: err => {
        console.error('Registration Error', err);
        this.registerError = true;

        if (err.status === 400) {
          this.registerErrorMessage = 'Invalid input: please check your data.';
        } else if (err.status === 409) {
          this.registerErrorMessage = 'Username or email already exists.';
        } else if (err.status ===403) {
          this.registerErrorMessage = 'Wrong email format';
        } else {
          this.registerErrorMessage = 'Registration failed. Please try again.';
        }
      },

    });
  }
}
