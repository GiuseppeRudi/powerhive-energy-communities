import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanManagement } from './plan-management';
import { PlanService } from '../../services/plan.service';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('PlanManagement', () => {
  let component: PlanManagement;
  let fixture: ComponentFixture<PlanManagement>;

  const planServiceSpy = jasmine.createSpyObj('PlanService', ['getAllPlans']);
  const authServiceSpy = jasmine.createSpyObj('AuthService', [], { user$: of(null) });

  beforeEach(async () => {
    planServiceSpy.getAllPlans.and.returnValue(of([]));
    spyOn(sessionStorage, 'getItem').and.returnValue(JSON.stringify({ id: 1 }));

    await TestBed.configureTestingModule({
      imports: [
        PlanManagement,
        HttpClientTestingModule,
        RouterTestingModule   // 👈 FIX DEFINITIVO
      ],
      providers: [
        { provide: PlanService, useValue: planServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PlanManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
