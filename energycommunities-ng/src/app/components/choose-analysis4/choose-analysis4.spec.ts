import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseAnalysis4 } from './choose-analysis4';

describe('ChooseAnalysis4', () => {
  let component: ChooseAnalysis4;
  let fixture: ComponentFixture<ChooseAnalysis4>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseAnalysis4]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseAnalysis4);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
