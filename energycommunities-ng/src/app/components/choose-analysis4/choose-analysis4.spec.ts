import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChooseAnalysis4 } from './choose-analysis4';
import { BatteryService } from '../../services/battery.service';
import { PlanService } from '../../services/plan.service';
import { AnalysisService } from '../../services/analysis.service';
import { HistoryService } from '../../services/history.service';
import { Router, ActivatedRoute, NavigationEnd, UrlTree } from '@angular/router';
import { of } from 'rxjs';

describe('ChooseAnalysis4', () => {
  let component: ChooseAnalysis4;
  let fixture: ComponentFixture<ChooseAnalysis4>;

  // Spy per i servizi
  let batteryServiceSpy: jasmine.SpyObj<BatteryService>;
  let planServiceSpy: jasmine.SpyObj<PlanService>;
  let analysisServiceSpy: jasmine.SpyObj<AnalysisService>;
  let historyServiceSpy: jasmine.SpyObj<HistoryService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Creazione dei mock
    batteryServiceSpy = jasmine.createSpyObj('BatteryService', ['get_batteries_by_plan']);
    planServiceSpy = jasmine.createSpyObj('PlanService', ['getDetailPlan']);
    analysisServiceSpy = jasmine.createSpyObj('AnalysisService', ['setAnalysisResult']);
    historyServiceSpy = jasmine.createSpyObj('HistoryService', ['getHistories', 'getHistoryMembers']);

    // FIX COMPLETO ROUTER: Oltre ai metodi, aggiungiamo le proprietà url e events
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree', 'serializeUrl']);

    // Configurazione ritorno metodi Router
    routerSpy.createUrlTree.and.returnValue({} as UrlTree);
    routerSpy.serializeUrl.and.returnValue('mock-url');

    // Configurazione proprietà Router (events e url) per RouterLink
    Object.defineProperty(routerSpy, 'events', { get: () => of(new NavigationEnd(0, 'url', 'urlAfterRedirects')) });
    Object.defineProperty(routerSpy, 'url', { get: () => '/mock-url' });

    // Mock servizi dati
    batteryServiceSpy.get_batteries_by_plan.and.returnValue(of([]));
    historyServiceSpy.getHistories.and.returnValue(of([]));
    planServiceSpy.getDetailPlan.and.returnValue(of({ id: 100, members: [] } as any));

    spyOn(sessionStorage, 'getItem').and.returnValue(JSON.stringify({ id: 1, plan_id: 100 }));

    await TestBed.configureTestingModule({
      imports: [ChooseAnalysis4],
      providers: [
        { provide: BatteryService, useValue: batteryServiceSpy },
        { provide: PlanService, useValue: planServiceSpy },
        { provide: AnalysisService, useValue: analysisServiceSpy },
        { provide: HistoryService, useValue: historyServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
            snapshot: { paramMap: { get: () => null } }
          }
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ChooseAnalysis4);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
