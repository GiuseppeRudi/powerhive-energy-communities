import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ResultAnalysis_1} from '../model/analysis/ResultAnalysis_1';
import {Observable} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HistoryService {

  private readonly baseUrl = 'http://localhost:8080/history';
  constructor(private readonly http: HttpClient) {}


  saveAnalysis(saveAnalysisRequest : SaveAnalysisRequest) : Observable<string>{
    return this.http.post(`${this.baseUrl}/save`, saveAnalysisRequest, { headers : { 'Content-Type' : 'application/json'} , responseType: 'text' });
  }
}
