import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalysisActionsComponent } from './analysis-save';
import { HistoryService } from '../../services/history.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AnalysisActionsComponent', () => {
  let component: AnalysisActionsComponent;
  let fixture: ComponentFixture<AnalysisActionsComponent>;

  const historyServiceSpy = jasmine.createSpyObj('HistoryService', ['saveHistory']);
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisActionsComponent],
      providers: [
        { provide: HistoryService, useValue: historyServiceSpy },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AnalysisActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
