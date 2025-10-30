import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {User} from '../model/User';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject : BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public user$ : Observable<User | null> = this.userSubject.asObservable();

  constructor(private http : HttpClient) { }

  private baseUrl: string = 'http://localhost:8080/users';

  login(username: string, password: string) {
    const body = { username, password };
    return this.http.post<User>(`${this.baseUrl}/login`, body, {
      withCredentials: true
    }).subscribe({
      next: (user) => this.userSubject.next(user),
      error: (error) => console.error('Login failed', error)
    });
  }

  logout() {
    this.userSubject.next(null);

    // da fare
  }

  register(registrationDto : any){
    return this.http.post(`${this.baseUrl}/register`, registrationDto);
  }

}
