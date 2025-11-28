import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryComponent } from './history';
import { HistoryService } from '../../services/history.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;

  const historyServiceSpy = jasmine.createSpyObj('HistoryService', ['getHistories', 'deleteHistory']);

  beforeEach(async () => {
    historyServiceSpy.getHistories.and.returnValue(of([])); // 👈 metodo corretto

    spyOn(sessionStorage, 'getItem').and.returnValue(JSON.stringify({ id: 1 }));

    await TestBed.configureTestingModule({
      imports: [
        HistoryComponent,
        RouterTestingModule // evita problemi con routerLink se presenti
      ],
      providers: [
        { provide: HistoryService, useValue: historyServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
