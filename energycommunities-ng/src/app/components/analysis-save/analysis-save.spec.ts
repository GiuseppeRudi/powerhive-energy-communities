import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisSave } from './analysis-save';

describe('AnalysisSave', () => {
  let component: AnalysisSave;
  let fixture: ComponentFixture<AnalysisSave>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisSave]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisSave);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
