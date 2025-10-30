import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/User';
import { Plan} from '../model/Plan';

@Injectable({ providedIn: 'root' })
export class PlanService {
  private readonly baseUrl = 'http://localhost:8080/plan';
  constructor(private readonly http: HttpClient) {}

  uploadCsv(file : File, ownerId : number) : Observable<any>{
    const formData = new FormData();
    formData.append('file', file);
    formData.append('ownerId', ownerId.toString());

    return this.http.post(`${this.baseUrl}/upload`, formData, { responseType: 'text' });
  }

}
