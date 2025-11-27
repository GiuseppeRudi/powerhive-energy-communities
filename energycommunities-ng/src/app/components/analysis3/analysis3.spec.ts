import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Analysis3 } from './analysis3';
import { AnalysisService } from '../../services/analysis.service';
import { HistoryService } from '../../services/history.service';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('Analysis3', () => {
  let component: Analysis3;
  let fixture: ComponentFixture<Analysis3>;

  const mockMembers = [
    { id: 1, fullName: 'Member 1', profiles: [] },
    { id: 2, fullName: 'Member 2', profiles: [] }
  ];

  const mockResultAnalysis = {
    defaultCommunity: { kpi1: Array(24).fill(10), kpi2: Array(24).fill(5), totalProduction: Array(24).fill(100), totalConsumption: Array(24).fill(50), assignments: [] },
    wantedCommunity: { kpi1: Array(24).fill(15), kpi2: Array(24).fill(10), totalProduction: Array(24).fill(120), totalConsumption: Array(24).fill(60), assignments: [] },
    optimalCommunity: { kpi1: Array(24).fill(30), kpi2: Array(24).fill(20), totalProduction: Array(24).fill(150), totalConsumption: Array(24).fill(80), assignments: [] }
  };

  const analysisServiceSpy = jasmine.createSpyObj('AnalysisService', ['getAnalysisResult', 'getResultAnalysis_3']);
  const historyServiceSpy = jasmine.createSpyObj('HistoryService', ['getHistoryById']);
  const authServiceSpy = jasmine.createSpyObj('AuthService', [], { user$: of({ id: 1 }) });
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    // Forzare i dati per far partire il flusso
    analysisServiceSpy.getAnalysisResult.and.returnValue({ members: mockMembers, wantToAdd: [2], wantToRemove: [1] });
    analysisServiceSpy.getResultAnalysis_3.and.returnValue(of(mockResultAnalysis));

    await TestBed.configureTestingModule({
      imports: [Analysis3],
      providers: [
        { provide: AnalysisService, useValue: analysisServiceSpy },
        { provide: HistoryService, useValue: historyServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(Analysis3);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable(); // Aspetta che gli observable finiscano
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load analysis data and build charts on init', () => {
    expect(analysisServiceSpy.getResultAnalysis_3).toHaveBeenCalled();
    expect(component.globalKpiChartData).toBeDefined();
    expect(component.globalProdConsChartData).toBeDefined();
  });

  it('should generate correct datasets for Global Production vs Consumption chart', () => {
    component.buildGlobalProdConsChart();
    expect(component.globalProdConsChartData?.datasets.length).toBe(6);
  });

  it('should generate correct datasets for Global KPI chart', () => {
    component.buildGlobalKpiChart();
    expect(component.globalKpiChartData?.datasets.length).toBe(6);
  });
});
