import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OngoingAnalysisComponent } from './ongoing-analysis'; // Import corretto del Componente
import { OngoingAnalysisService } from '../../services/ongoing-analysis.service';
import { ClingoEventsService } from '../../services/clingo-events.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('OngoingAnalysisComponent', () => {
  let component: OngoingAnalysisComponent;
  let fixture: ComponentFixture<OngoingAnalysisComponent>;

  // Creiamo i mock (Spy) per i servizi usati dal componente
  const analysisServiceSpy = jasmine.createSpyObj('OngoingAnalysisService', ['getAll', 'openAnalysis']);
  const clingoEventsSpy = jasmine.createSpyObj('ClingoEventsService', ['connect', 'disconnect']);
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    // Simuliamo la risposta del servizio getAll (array vuoto)
    analysisServiceSpy.getAll.and.returnValue(of([]));

    // Simuliamo il sessionStorage per evitare errori in ngOnInit (serve un utente loggato)
    spyOn(sessionStorage, 'getItem').and.callFake((key) => {
      if (key === 'currentUser') return JSON.stringify({ id: 1, email: 'test@test.com' });
      return null;
    });

    await TestBed.configureTestingModule({
      imports: [OngoingAnalysisComponent], // Il componente è standalone, va negli imports
      providers: [
        { provide: OngoingAnalysisService, useValue: analysisServiceSpy },
        { provide: ClingoEventsService, useValue: clingoEventsSpy },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignora errori di template (componenti figli non mockati)
    })
      .compileComponents();

    fixture = TestBed.createComponent(OngoingAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
