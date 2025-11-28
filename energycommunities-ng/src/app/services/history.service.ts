import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {SaveAnalysisRequest} from '../model/SaveAnalysisRequest';
import {HistorySummary} from '../model/history/HistorySummary';
import {HistoryDetail} from '../model/history/HistoryDetail';

@Injectable({ providedIn: 'root' })
export class HistoryService {

  private readonly baseUrl = 'http://localhost:8080/history';
  constructor(private readonly http: HttpClient) {}


  getHistories(userId:number) : Observable<HistorySummary[]> {
    console.log(userId);
    return this.http.get<HistorySummary[]>(`${this.baseUrl}/getAll/${userId}`);
  }

  saveAnalysis(saveAnalysisRequest : SaveAnalysisRequest) : Observable<string>{
    return this.http.post(`${this.baseUrl}/save`, saveAnalysisRequest, { headers : { 'Content-Type' : 'application/json'} , responseType: 'text' });
  }

  getHistoryById(id: number): Observable<HistoryDetail> {
    return this.http.get<HistoryDetail>(`${this.baseUrl}/get/${id}`);
  }
  getHistoryMembers(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getMembers/${id}`);
  }
}
