import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    CommonModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true
})
export class Login {

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


  constructor(private authService: AuthService) {}

  onLogin(){

    this.authService.login(this.username, this.password);
    alert(`Login con utente: ${this.username}`);


    console.log('login', this.username);
    console.log('password', this.password);
    alert(`Login con utente: ${this.username}`);
  }

  onRegister(){
    const registrationDto ={
      username: this.regUsername,
      password: this.regPassword,
      firstName : this.regFirstName,
      lastName : this.regLastName,

    };

    this.authService.register(registrationDto).subscribe({
      next: result => console.log('Register successful!', result),
      error: error => console.log('Register Error', error)
    });
  }
}
