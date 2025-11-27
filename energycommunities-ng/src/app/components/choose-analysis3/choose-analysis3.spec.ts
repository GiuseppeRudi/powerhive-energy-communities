import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChooseAnalysis3 } from './choose-analysis3';
import { PlanService } from '../../services/plan.service';
import { AnalysisService } from '../../services/analysis.service';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('ChooseAnalysis3', () => {
  let component: ChooseAnalysis3;
  let fixture: ComponentFixture<ChooseAnalysis3>;

  const planServiceSpy = jasmine.createSpyObj('PlanService', ['getDetailPlan']);
  const analysisServiceSpy = jasmine.createSpyObj('AnalysisService', ['setAnalysisResult']);
  const authServiceSpy = jasmine.createSpyObj('AuthService', [], { user$: of({ plan_id: 1 }) });

  beforeEach(async () => {
    planServiceSpy.getDetailPlan.and.returnValue(of({ members: [] }));
    spyOn(sessionStorage, 'getItem').and.returnValue(JSON.stringify({ plan_id: 1 }));

    await TestBed.configureTestingModule({
      imports: [
        ChooseAnalysis3,
        RouterTestingModule  // 👈 OBBLIGATORIO
      ],
      providers: [
        { provide: PlanService, useValue: planServiceSpy },
        { provide: AnalysisService, useValue: analysisServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ChooseAnalysis3);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
