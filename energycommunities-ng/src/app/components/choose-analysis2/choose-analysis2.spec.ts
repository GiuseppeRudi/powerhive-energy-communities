import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChooseAnalysis2 } from './choose-analysis2';
import { PlanService } from '../../services/plan.service';
import { AnalysisService } from '../../services/analysis.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ChooseAnalysis2', () => {
  let component: ChooseAnalysis2;
  let fixture: ComponentFixture<ChooseAnalysis2>;

  const planServiceSpy = jasmine.createSpyObj('PlanService', ['getDetailPlan']);
  const analysisServiceSpy = jasmine.createSpyObj('AnalysisService', ['setAnalysisResult']);
  const authServiceSpy = jasmine.createSpyObj('AuthService', [], { user$: of({ plan_id: 1 }) });

  const routerEvents$ = new Subject();
  const routerSpy = jasmine.createSpyObj(
    'Router',
    ['navigate', 'createUrlTree', 'serializeUrl'],
    { events: routerEvents$ }
  );

  routerSpy.createUrlTree.and.returnValue('/fake');
  routerSpy.serializeUrl.and.returnValue('/fake');

  beforeEach(async () => {
    planServiceSpy.getDetailPlan.and.returnValue(of({ members: [] }));

    spyOn(sessionStorage, 'getItem').and.returnValue(JSON.stringify({ plan_id: 1 }));

    await TestBed.configureTestingModule({
      imports: [ChooseAnalysis2],
      providers: [
        { provide: PlanService, useValue: planServiceSpy },
        { provide: AnalysisService, useValue: analysisServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ChooseAnalysis2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
