import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ResultAnalysis_1} from '../model/analysis/ResultAnalysis_1';
import {Observable} from 'rxjs';
import {Analysis1} from '../components/analysis1/analysis1';

@Injectable({ providedIn: 'root' })
export class AnalysisService {

  private readonly baseUrl = 'http://localhost:8080/analysis';
  constructor(private readonly http: HttpClient) {}


  getResultAnalysis_1(memberIds?: number[]): Observable<ResultAnalysis_1> {
    if (memberIds && memberIds.length > 0) {
      const params = { memberIds: memberIds.join(',') };
      return this.http.get<ResultAnalysis_1>(`${this.baseUrl}/start_1`, { params });
    }
    return this.http.get<ResultAnalysis_1>(`${this.baseUrl}/start_1`);
  }


}
