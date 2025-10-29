import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Plan } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PlanService {
  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<User> {
    return this.http.get<User>('/api/users/current');
  }

  getPlan(planId: number): Observable<Plan> {
    return this.http.get<Plan>(`/api/plans/${planId}`);
  }
}
