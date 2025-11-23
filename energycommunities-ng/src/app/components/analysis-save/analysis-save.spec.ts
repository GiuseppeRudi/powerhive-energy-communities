import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisActionsComponent } from './analysis-save';

describe('AnalysisActionsComponent', () => {
  let component: AnalysisActionsComponent;
  let fixture: ComponentFixture<AnalysisActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisActionsComponent]
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
