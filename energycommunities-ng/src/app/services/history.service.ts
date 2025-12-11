import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {SaveAnalysisRequest} from '../model/SaveAnalysisRequest';
import {HistorySummary} from '../model/history/HistorySummary';
import {HistoryDetail} from '../model/history/HistoryDetail';
import {isResultAnalysis4, ResultAnalysis_4} from '../model/analysis/ResultAnalysis_4';

@Injectable({ providedIn: 'root' })
export class HistoryService {

  private readonly baseUrl = 'http://localhost:8080/history';
  constructor(private readonly http: HttpClient) {}


  getHistories(userId:number) : Observable<HistorySummary[]> {
    console.log(userId);
    return this.http.get<HistorySummary[]>(`${this.baseUrl}/getAll/${userId}`);
  }

  deleteHistory(historyId:number) : Observable<Response> {
    return this.http.get<Response>(`${this.baseUrl}/remove/${historyId}`);
  }

  saveAnalysis(saveAnalysisRequest: SaveAnalysisRequest): Observable<string> {
    const payload: SaveAnalysisRequest = {
    userId: saveAnalysisRequest.userId,
    analysisName: saveAnalysisRequest.analysisName,
    analysisNumber: saveAnalysisRequest.analysisNumber,
    analysisData: this.buildAnalysisDataWithAssignmentsEntries(saveAnalysisRequest.analysisData)
  };

  // debug: verifica la serializzazione reale del payload
  console.log('Sending payload:', JSON.stringify(payload));

  return this.http.post(`${this.baseUrl}/save`, payload, {
    headers: { 'Content-Type': 'application/json' },
    responseType: 'text'
  });
  }



  buildAnalysisDataWithAssignmentsEntries(original: any): any {
    if (!isResultAnalysis4(original)) {
      return { ...(original ?? {}) };
    }

    const a = original.assignments;

    let assignmentsEntries: [any, any][] = [];

    if (a instanceof Map) {
      assignmentsEntries = Array.from(a.entries());
    }
    return {
      ...original,
      assignments: assignmentsEntries
    };
  }

  buildAnalysisDataWithAssignmentsMap(original: any): any {
    if (!isResultAnalysis4(original)) {
      return original;
    }

    const a = original.assignments;
    let assignmentsMap = new Map<number, number>();

    if (Array.isArray(a) && a.length > 0 && Array.isArray(a[0])) {
      // array di entries: [[k,v],...]
      for (const pair of a as [any, any][]) {
        const k = Number(pair[0]);
        const v = Number(pair[1]);
        if (!Number.isNaN(k)) assignmentsMap.set(k, v);
      }
    }

    return {
      ...original,
      assignments: assignmentsMap
    };
  }


  getHistoryById(id: number): Observable<HistoryDetail> {
    return this.http.get<HistoryDetail>(`${this.baseUrl}/get/${id}`);
  }

  getHistoryMembers(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getMembers/${id}`);
  }
}
