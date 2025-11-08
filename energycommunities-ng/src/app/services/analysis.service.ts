import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ResultAnalysis_1} from '../model/analysis/ResultAnalysis_1';
import {Observable} from 'rxjs';
import {Analisys1} from '../components/analisys1/analisys1';

@Injectable({ providedIn: 'root' })
export class AnalysisService {

  private readonly baseUrl = 'http://localhost:8080/analysis';
  constructor(private readonly http: HttpClient) {}


  getResultAnalysis_1() : Observable<ResultAnalysis_1>{
    return this.http.get<ResultAnalysis_1>(`${this.baseUrl}/start_1`);
  }

}
