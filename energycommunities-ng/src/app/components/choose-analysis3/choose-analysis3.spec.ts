import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChooseAnalysis3 } from './choose-analysis3';
import { HistoryService } from '../../services/history.service';
import { PlanService } from '../../services/plan.service';
import { AuthService } from '../../services/auth/auth.service';
import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

class MockHistoryService {
  getHistories(userId: number) {
    return of([]);
  }
  getHistoryMembers(id: number) {
    return of([]);
  }
}

describe('ChooseAnalysis3', () => {
  let component: ChooseAnalysis3;
  let fixture: ComponentFixture<ChooseAnalysis3>;
  let historyService: HistoryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseAnalysis3],


      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),

        { provide: HistoryService, useClass: MockHistoryService },
        PlanService,
        AuthService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChooseAnalysis3);
    component = fixture.componentInstance;
    historyService = TestBed.inject(HistoryService);

    sessionStorage.setItem('currentUser', JSON.stringify({ id: 1, plan_id: 100 }));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loadHistory should filter only analysisNumber 2', () => {
    const mockData = [
      { id: 1, analysisNumber: 1, createdAt: '2023-01-01' },
      { id: 2, analysisNumber: 2, createdAt: '2023-02-01' }
    ];

    spyOn(historyService, 'getHistories').and.returnValue(of(mockData as any));

    component.loadHistory();

    expect(component.historyList.length).toBe(1);
    expect(component.historyList[0].id).toBe(2);
  });

  it('addCommunityDefault should handle valid and missing members', () => {
    component.members = [
      { id: 10, fullName: 'Mario Rossi' } as any,
      { id: 20, fullName: 'Luigi Verdi' } as any
    ];

    const backendResponse = [
      { id: 10, fullName: 'Mario Rossi' },
      { id: 99, fullName: 'Vecchio Utente' }
    ];

    spyOn(historyService, 'getHistoryMembers').and.returnValue(of(backendResponse));

    component.addCommunityDefault(123);

    expect(component.communityMembers).toContain(10);
    expect(component.showMissingWarning).toBeTrue();
    expect(component.missingMembersList).toContain('Vecchio Utente');
  });
});
