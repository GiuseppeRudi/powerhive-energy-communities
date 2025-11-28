import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MemberChooser } from './member-chooser';
import { AuthService } from '../../services/auth/auth.service';
import { PlanService } from '../../services/plan.service';
import { AnalysisService } from '../../services/analysis.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MemberChooser', () => {
  let component: MemberChooser;
  let fixture: ComponentFixture<MemberChooser>;

  const authServiceSpy = jasmine.createSpyObj('AuthService', [], { user$: of({ plan_id: 1 }) });
  const planServiceSpy = jasmine.createSpyObj('PlanService', ['getDetailPlan', 'getSummaryPlan']);
  const analysisServiceSpy = jasmine.createSpyObj('AnalysisService', ['setAnalysisResult']);

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
    planServiceSpy.getSummaryPlan.and.returnValue(of({ members: [] }));

    spyOn(sessionStorage, 'getItem').and.returnValue(JSON.stringify({ plan_id: 1 }));

    await TestBed.configureTestingModule({
      imports: [MemberChooser],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: PlanService, useValue: planServiceSpy },
        { provide: AnalysisService, useValue: analysisServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MemberChooser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
