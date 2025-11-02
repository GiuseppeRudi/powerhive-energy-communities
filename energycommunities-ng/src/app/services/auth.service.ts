import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {User} from '../model/User';
import {BehaviorSubject, Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject : BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public user$ : Observable<User | null> = this.userSubject.asObservable();

  constructor(private http : HttpClient) { }

  private baseUrl: string = 'http://localhost:8080/users';

  login(username: string, password: string): Observable<User> {
    const body = { username, password };
    return this.http.post<User>(`${this.baseUrl}/login`, body, {
      withCredentials: true
    }).pipe(
      tap(user => this.userSubject.next(user))
    );
  }


  logout() {
    this.userSubject.next(null);

    // da fare
  }

  register(registrationDto : any){
    return this.http.post(`${this.baseUrl}/register`, registrationDto);
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  setUserField<K extends keyof User>(field: K, value: User[K]): void {
    const currentUser = this.userSubject.value;

    if (currentUser) {
      const updatedUser = { ...currentUser, [field]: value };
      this.userSubject.next(updatedUser);
    }
  }


}
