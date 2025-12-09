import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Analysis4 } from './analysis4';
import { AnalysisService } from '../../services/analysis.service';
import { AuthService } from '../../services/auth/auth.service';
import { HistoryService } from '../../services/history.service';
import { ClingoEventsService } from '../../services/clingo-events.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ResultAnalysis_4 } from '../../model/analysis/ResultAnalysis_4';

describe('Analysis4', () => {
  let component: Analysis4;
  let fixture: ComponentFixture<Analysis4>;

  // Spy per i servizi
  let analysisServiceSpy: jasmine.SpyObj<AnalysisService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let historyServiceSpy: jasmine.SpyObj<HistoryService>;
  let clingoEventsSpy: jasmine.SpyObj<ClingoEventsService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    analysisServiceSpy = jasmine.createSpyObj('AnalysisService', ['getResultAnalysis_4', 'runAsync1', 'getAnalysisResult']);
    authServiceSpy = jasmine.createSpyObj('AuthService', [], { currentUserValue: { id: 1 } });
    historyServiceSpy = jasmine.createSpyObj('HistoryService', ['getHistoryById']);
    clingoEventsSpy = jasmine.createSpyObj('ClingoEventsService', ['connect', 'disconnect']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Mock della request
    analysisServiceSpy.getAnalysisResult.and.returnValue(undefined);

    await TestBed.configureTestingModule({
      imports: [Analysis4],
      providers: [
        { provide: AnalysisService, useValue: analysisServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: HistoryService, useValue: historyServiceSpy },
        { provide: ClingoEventsService, useValue: clingoEventsSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
            snapshot: { paramMap: { get: () => null } }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Analysis4);
    component = fixture.componentInstance;

    // FIX: Definiamo il mock DENTRO il beforeEach per evitare che venga sporcato
    // dal metodo resetAnalysisData() tra un test e l'altro.
    const mockResultAnalysis: ResultAnalysis_4 = {
      startingCommunity: {
        assignments: [],
        totalConsumption: Array.from({ length: 24 }, () => 10), // 10 kWh/h
        totalProduction: Array.from({ length: 24 }, () => 5),   // 5 kWh/h
        kpi1: [],
        kpi2: []
      } as any,
      batteries: [
        { id: 1, model: 'Tesla Wall', capacity: 13.5, price: 5000, maxChargeRate: 5, maxDischargeRate: 5 }
      ],
      assignments: new Map(),
      totalConsumption: Array.from({ length: 24 }, () => 8), // 8 kWh/h (con batteria)
      totalProduction: Array.from({ length: 24 }, () => 5),
      kpi1: [],
      kpi2: [],
      batteryStatus: []
    } as unknown as ResultAnalysis_4;

    fixture.detectChanges(); // ngOnInit gira qui
    component.resultAnalysis = mockResultAnalysis; // Sovrascriviamo con dati puliti
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- TEST VALIDAZIONE INPUT ---

  it('should validate Energy Cost correctly (range 0-1)', () => {
    component.energyCost = 0.30;
    expect(component.validateInputs()).toBeTrue();
    expect(component.inputErrors.cost).toBeFalse();

    component.energyCost = 1.5;
    expect(component.validateInputs()).toBeFalse();
    expect(component.inputErrors.cost).toBeTrue();

    component.energyCost = -0.1;
    expect(component.validateInputs()).toBeFalse();
    expect(component.inputErrors.cost).toBeTrue();
  });

  it('should validate Battery Lifespan (must be positive)', () => {
    component.energyCost = 0.3;
    component.batteryLifespan = 10;
    expect(component.validateInputs()).toBeTrue();

    component.batteryLifespan = -5;
    expect(component.validateInputs()).toBeFalse();
    expect(component.inputErrors.lifespan).toBeTrue();
  });

  it('should validate Max Payback (must be positive)', () => {
    component.energyCost = 0.3;
    component.maxPaybackDesired = 5;
    expect(component.validateInputs()).toBeTrue();

    component.maxPaybackDesired = -2;
    expect(component.validateInputs()).toBeFalse();
    expect(component.inputErrors.payback).toBeTrue();
  });

  it('should validate Degradation Rate (must be positive)', () => {
    component.energyCost = 0.3;
    component.degradationRate = 2.0;
    expect(component.validateInputs()).toBeTrue();

    component.degradationRate = -1;
    expect(component.validateInputs()).toBeFalse();
    expect(component.inputErrors.degradation).toBeTrue();
  });

  // --- TEST LOGICA DI CALCOLO ---

  it('should NOT update summary if inputs are invalid', () => {
    component.energyCost = 2.0;
    component.updateSummary();

    expect(component.summary).toBeNull();
    expect(component.inputErrors.cost).toBeTrue();
  });

  it('should calculate summary correctly with valid inputs', () => {
    component.energyCost = 0.50;
    component.batteryLifespan = 15;
    component.maxPaybackDesired = 10;
    component.degradationRate = 2;

    component.updateSummary();

    expect(component.summary).not.toBeNull();

    if (component.summary) {
      // (10 - 5) * 0.5 * 24 * 365 = positivo
      expect(component.summary.annualCostWithoutBattery).toBeGreaterThan(0);
      // (8 - 5) * 0.5 * 24 * 365 < precedente
      expect(component.summary.annualCostWithBattery).toBeLessThan(component.summary.annualCostWithoutBattery);
      expect(component.summary.annualSavings).toBeGreaterThan(0);
      expect(component.summary.batteryInvestment).toBe(5000);
    }
  });

  it('should generate payback chart data after calculation', () => {
    component.energyCost = 0.50;
    component.updateSummary();

    expect(component.paybackChartData.labels?.length).toBeGreaterThan(0);
    expect(component.paybackChartData.datasets.length).toBe(2);
  });

  // --- TEST INTERAZIONE UI ---

  it('should toggle member expansion state', () => {
    const memberId = 123;
    expect(component.isMemberExpanded(memberId)).toBeFalse();
    component.toggleMember(memberId);
    expect(component.isMemberExpanded(memberId)).toBeTrue();
    component.toggleMember(memberId);
    expect(component.isMemberExpanded(memberId)).toBeFalse();
  });

  it('should reset data correctly', () => {
    // Questo test svuota il mock, ecco perché il mock deve essere ricreato nel beforeEach
    component.chartDataMap.set(1, {} as any);
    component.resetAnalysisData();
    expect(component.chartDataMap.size).toBe(0);
    expect(component.optConsProfChart).toBeUndefined();
    // Verifica che abbia svuotato i dati
    expect(component.resultAnalysis?.startingCommunity.totalConsumption.length).toBe(0);
  });
});
