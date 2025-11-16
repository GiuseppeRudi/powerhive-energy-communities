import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseAnalysis2 } from './choose-analysis2';

describe('ChooseAnalysis2', () => {
  let component: ChooseAnalysis2;
  let fixture: ComponentFixture<ChooseAnalysis2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseAnalysis2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseAnalysis2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
