import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingAnalysis } from './ongoing-analysis';

describe('OngoingAnalysis', () => {
  let component: OngoingAnalysis;
  let fixture: ComponentFixture<OngoingAnalysis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OngoingAnalysis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OngoingAnalysis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
