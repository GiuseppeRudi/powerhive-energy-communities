import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseAnalysis3 } from './choose-analysis3';

describe('ChooseAnalysis3', () => {
  let component: ChooseAnalysis3;
  let fixture: ComponentFixture<ChooseAnalysis3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseAnalysis3]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseAnalysis3);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
