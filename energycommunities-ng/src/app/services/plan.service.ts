import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import { Plan} from '../model/plan/Plan';
import {MemberDetail} from '../model/member/MemberDetail';
import {ResultAnalysis_1} from '../model/analysis/ResultAnalysis_1';

@Injectable({ providedIn: 'root' })
export class PlanService {

  private readonly planSubject : BehaviorSubject<Plan | null> = new BehaviorSubject<Plan | null>(null);
  public plan$ : Observable<Plan | null> = this.planSubject.asObservable();


  private readonly baseUrl = 'http://localhost:8080/plan';
  constructor(private readonly http: HttpClient) {}

  uploadCsv(file : File, ownerId : number) : Observable<string>{
    const formData = new FormData();
    formData.append('file', file);
    formData.append('ownerId', ownerId.toString());

    return this.http.post(`${this.baseUrl}/upload`, formData, { responseType: 'text' });
  }

  getPlan(planID : number) : Observable<Plan>{
    return this.http.get<Plan>(`${this.baseUrl}/${planID}`);
  }

  getMember(planID : number, memberId : number) : Observable<MemberDetail>{
    return this.http.get<MemberDetail>(`${this.baseUrl}/${planID}/${memberId}`);
  }

}
