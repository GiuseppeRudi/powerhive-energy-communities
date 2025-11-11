import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Analysis3 } from './analysis3';

describe('Analysis3', () => {
  let component: Analysis3;
  let fixture: ComponentFixture<Analysis3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Analysis3]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Analysis3);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
