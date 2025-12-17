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

  let routerSpy: jasmine.SpyObj<Router>;
  let batteryServiceSpy: jasmine.SpyObj<BatteryService>;
  let planServiceSpy: jasmine.SpyObj<PlanService>;
  let analysisServiceSpy: jasmine.SpyObj<AnalysisService>;
  let historyServiceSpy: jasmine.SpyObj<HistoryService>;

  beforeEach(async () => {
    batteryServiceSpy = jasmine.createSpyObj('BatteryService', ['get_batteries_by_plan']);
    planServiceSpy = jasmine.createSpyObj('PlanService', ['getDetailPlan']);
    analysisServiceSpy = jasmine.createSpyObj('AnalysisService', ['setAnalysisResult']);
    historyServiceSpy = jasmine.createSpyObj('HistoryService', ['getHistories', 'getHistoryMembers']);

    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree', 'serializeUrl']);

    routerSpy.createUrlTree.and.returnValue({} as UrlTree);
    routerSpy.serializeUrl.and.returnValue('mock-url');

    Object.defineProperty(routerSpy, 'events', { get: () => of(new NavigationEnd(0, 'url', 'urlAfterRedirects')) });
    Object.defineProperty(routerSpy, 'url', { get: () => '/mock-url' });

    batteryServiceSpy.get_batteries_by_plan.and.returnValue(of([]));
    historyServiceSpy.getHistories.and.returnValue(of([]));
    planServiceSpy.getDetailPlan.and.returnValue(of({ id: 100, members: [] } as any));


    spyOn(sessionStorage, 'getItem').and.returnValue(JSON.stringify({ id: 1, plan_id: 100 }));

    await TestBed.configureTestingModule({
      imports: [ChooseAnalysis4], // Se è standalone
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
    }).compileComponents();


    fixture = TestBed.createComponent(ChooseAnalysis4);
    component = fixture.componentInstance;


    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle member selection', () => {
    component.energyCommunities = [];
    component.toggleSelection(5);
    expect(component.energyCommunities).toContain(5);

    component.toggleSelection(5);
    expect(component.energyCommunities).not.toContain(5);
  });

  it('should select and deselect all members', () => {
    component.members = [{ id: 1 }, { id: 2 }] as any;

    component.selectAll();
    expect(component.energyCommunities.length).toBe(2);

    component.deselectAll();
    expect(component.energyCommunities.length).toBe(0);
  });

  it('should detect full and partial selections', () => {
    component.members = [{ id: 1 }, { id: 2 }] as any;

    component.energyCommunities = [1, 2];
    expect(component.isAllSelected()).toBeTrue();

    component.energyCommunities = [1];
    expect(component.isIndeterminate()).toBeTrue();
  });

  it('should start analysis and navigate', () => {
    component.members = [{ id: 1 }, { id: 2 }] as any;
    component.plan_batteries = [{ id: 10 }] as any;

    component.energyCommunities = [1];
    component.batteriesList = [10];
    component.budget = 500;

    component.startAnalysis4();


    expect(analysisServiceSpy.setAnalysisResult).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      ['/analysis4'],
      {state: {allowAnalysis: true}});
  });
});

