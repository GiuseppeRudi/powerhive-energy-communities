import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ResultAnalysis_1} from '../model/analysis/ResultAnalysis_1';
import {Observable} from 'rxjs';
import {Analysis1} from '../components/analysis1/analysis1';
import {ResultAnalysis_2} from '../model/analysis/ResultAnalysis_2';
import { MemberSummary } from "../model/member/MemberSummary";

@Injectable({providedIn: 'root'})
export class AnalysisService {

  private readonly baseUrl = 'http://localhost:8080/analysis';

  constructor(private readonly http: HttpClient) {
  }


  getResultAnalysis_1(): Observable<ResultAnalysis_1> {
    return this.http.get<ResultAnalysis_1>(`${this.baseUrl}/start_1`);
  }

  getResultAnalysis_2(members: MemberSummary[], dimCommunity: number ) : Observable<ResultAnalysis_2>{
    const body = {
      members: members,
      dimCommunity: dimCommunity
    };
    return this.http.post<ResultAnalysis_1>(`${this.baseUrl}/start_2`,body);
  }

}
