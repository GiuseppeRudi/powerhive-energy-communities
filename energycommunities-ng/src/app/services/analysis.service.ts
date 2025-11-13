import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ResultAnalysis_1} from '../model/analysis/ResultAnalysis_1';
import {Observable} from 'rxjs';
import {Analysis1} from '../components/analysis1/analysis1';
import {ResultAnalysis_2} from '../model/analysis/ResultAnalysis_2';
import { MemberSummary } from "../model/member/MemberSummary";
import {MemberDetail} from '../model/member/MemberDetail';
import {ResultAnalysis_3} from '../model/analysis/ResultAnalysis_3';

@Injectable({providedIn: 'root'})
export class AnalysisService {

  private readonly baseUrl = 'http://localhost:8080/analysis';


  private currentResultAnalysis: any ;

    constructor(private readonly http: HttpClient) {
  }

  getResultAnalysis_1(memberIds?: number[]): Observable<ResultAnalysis_1> {
    if (memberIds && memberIds.length > 0) {
      const params = { memberIds: memberIds.join(',') };
      return this.http.get<ResultAnalysis_1>(`${this.baseUrl}/start_1`, { params });
    }
    return this.http.get<ResultAnalysis_1>(`${this.baseUrl}/start_1`);
  }

  getResultAnalysis_2(members: MemberDetail[], dimCommunity: number ) : Observable<ResultAnalysis_2>{
    const body = {
      members: members,
      dimCommunity: dimCommunity
    };
    return this.http.post<ResultAnalysis_2>(`${this.baseUrl}/start_2`,body);
  }

  setAnalysisResult(result: any) {
    this.currentResultAnalysis = result;
  }

  // Recupera il risultato
  getAnalysisResult() {
    return this.currentResultAnalysis;
  }

  getResultAnalysis_3(members: MemberDetail[], wantToAdd: number[], wantToRemove: number[] ) : Observable<ResultAnalysis_3>{
    const body = {
      members: members,
      wantToAdd: wantToAdd,
      wantToRemove: wantToRemove
    };
    return this.http.post<ResultAnalysis_3>(`${this.baseUrl}/start_3`,body);
  }
}
