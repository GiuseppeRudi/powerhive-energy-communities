import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {OngoingAnalysis} from '../model/analysis/OngoingAnalysis';

@Injectable({
  providedIn: 'root'
})
export class OngoingAnalysisService {

  private readonly baseUrl = 'http://localhost:8080/ongoing';

  constructor(private http: HttpClient) {}

  getAll(id: number) {
    return this.http.get<OngoingAnalysis[]>(`${this.baseUrl}/${id}`);
  }

  openAnalysis(id: number) {
    return this.http.get(`${this.baseUrl}/open/${id}`);
  }
}
