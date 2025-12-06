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

  // Dati mockati complessi
  const mockResultAnalysis: ResultAnalysis_4 = {
    startingCommunity: {
      assignments: [],
      // Arrays di 24 ore pieni per evitare errori nei cicli for
      totalConsumption: new Array(24).fill(10),
      totalProduction: new Array(24).fill(5),
      kpi1: [],
      kpi2: []
    } as any,
    batteries: [
      { id: 1, model: 'Tesla Wall', capacity: 13.5, price: 5000, maxChargeRate: 5, maxDischargeRate: 5 }
    ],
    assignments: new Map(),
    // Dati post-ottimizzazione
    totalConsumption: new Array(24).fill(8),
    totalProduction: new Array(24).fill(5),
    kpi1: [],
    kpi2: [],
    batteryStatus: []
  } as unknown as ResultAnalysis_4;

  beforeEach(async () => {
    analysisServiceSpy = jasmine.createSpyObj('AnalysisService', ['getResultAnalysis_4', 'runAsync1']);
    authServiceSpy = jasmine.createSpyObj('AuthService', [], { currentUserValue: { id: 1 } });
    historyServiceSpy = jasmine.createSpyObj('HistoryService', ['getHistoryById']);
    clingoEventsSpy = jasmine.createSpyObj('ClingoEventsService', ['connect', 'disconnect']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

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

    // 1. Eseguiamo detectChanges PRIMA di assegnare i dati mockati.
    // Questo fa girare ngOnInit, che setterebbe resultAnalysis a null.
    fixture.detectChanges();

    // 2. Ora sovrascriviamo resultAnalysis con i dati mockati, pronti per i test.
    component.resultAnalysis = mockResultAnalysis;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- TEST VALIDAZIONE INPUT ---

  it('should validate Energy Cost correctly (range 0-1)', () => {
    // Caso Valido
    component.energyCost = 0.30;
    expect(component.validateInputs()).toBeTrue();
    expect(component.inputErrors.cost).toBeFalse();

    // Caso Errore: Troppo alto
    component.energyCost = 1.5;
    expect(component.validateInputs()).toBeFalse();
    expect(component.inputErrors.cost).toBeTrue();

    // Caso Errore: Negativo
    component.energyCost = -0.1;
    expect(component.validateInputs()).toBeFalse();
    expect(component.inputErrors.cost).toBeTrue();
  });

  it('should validate Battery Lifespan (must be positive)', () => {
    component.energyCost = 0.3;

    // Caso Valido
    component.batteryLifespan = 10;
    expect(component.validateInputs()).toBeTrue();

    // Caso Errore: Negativo
    component.batteryLifespan = -5;
    expect(component.validateInputs()).toBeFalse();
    expect(component.inputErrors.lifespan).toBeTrue();
  });

  it('should validate Max Payback (must be positive)', () => {
    component.energyCost = 0.3;

    // Caso Valido
    component.maxPaybackDesired = 5;
    expect(component.validateInputs()).toBeTrue();

    // Caso Errore
    component.maxPaybackDesired = -2;
    expect(component.validateInputs()).toBeFalse();
    expect(component.inputErrors.payback).toBeTrue();
  });

  it('should validate Degradation Rate (must be positive)', () => {
    component.energyCost = 0.3;

    // Caso Valido
    component.degradationRate = 2.0;
    expect(component.validateInputs()).toBeTrue();

    // Caso Errore
    component.degradationRate = -1;
    expect(component.validateInputs()).toBeFalse();
    expect(component.inputErrors.degradation).toBeTrue();
  });

  // --- TEST LOGICA DI CALCOLO ---

  it('should NOT update summary if inputs are invalid', () => {
    component.energyCost = 2.0; // Invalido
    component.updateSummary();

    expect(component.summary).toBeNull();
    expect(component.inputErrors.cost).toBeTrue();
  });

  it('should calculate summary correctly with valid inputs', () => {
    // Setup inputs validi
    component.energyCost = 0.50;
    component.batteryLifespan = 15;
    component.maxPaybackDesired = 10;
    component.degradationRate = 2;

    // Poiché abbiamo iniettato resultAnalysis nel beforeEach DOPO detectChanges,
    // qui resultAnalysis NON è null.
    component.updateSummary();

    // Verifiche
    expect(component.summary).not.toBeNull(); // Questo ora passerà

    if (component.summary) {
      // Costo senza batteria: (10 cons - 5 prod) * 0.50 * 24h * 365gg
      expect(component.summary.annualCostWithoutBattery).toBeGreaterThan(0);

      // Con batteria consumiamo meno (8 invece di 10 nel mock), quindi costa meno
      expect(component.summary.annualCostWithBattery).toBeLessThan(component.summary.annualCostWithoutBattery);

      expect(component.summary.annualSavings).toBeGreaterThan(0);
      expect(component.summary.batteryInvestment).toBe(5000);
    }
  });

  it('should generate payback chart data after calculation', () => {
    component.energyCost = 0.50;
    component.updateSummary();

    // Se il summary viene calcolato, anche i dati del grafico vengono popolati
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
    component.chartDataMap.set(1, {} as any);
    component.resetAnalysisData();

    expect(component.chartDataMap.size).toBe(0);
    expect(component.optConsProfChart).toBeUndefined();
  });

});
