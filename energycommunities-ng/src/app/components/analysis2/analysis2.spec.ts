import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Analysis2 } from './analysis2';
import { AnalysisService } from '../../services/analysis.service';
import { HistoryService } from '../../services/history.service';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('Analysis2', () => {
  let component: Analysis2;
  let fixture: ComponentFixture<Analysis2>;

  const analysisServiceSpy = jasmine.createSpyObj('AnalysisService', ['getAnalysisResult', 'getResultAnalysis_2']);
  const historyServiceSpy = jasmine.createSpyObj('HistoryService', ['getHistoryById']);
  const authServiceSpy = jasmine.createSpyObj('AuthService', [], { user$: of(null) });
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    analysisServiceSpy.getAnalysisResult.and.returnValue({ members: [] }); // Dati mock minimi
    analysisServiceSpy.getResultAnalysis_2.and.returnValue(of({
      optimalCommunity: { kpi1: [], kpi2: [], totalProduction: [], totalConsumption: [], assignments: [] }
    }));

    await TestBed.configureTestingModule({
      imports: [Analysis2],
      providers: [
        { provide: AnalysisService, useValue: analysisServiceSpy },
        { provide: HistoryService, useValue: historyServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Analysis2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
