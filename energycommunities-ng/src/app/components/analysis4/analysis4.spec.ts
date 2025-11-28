import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Analysis4 } from './analysis4';

describe('Analysis4', () => {
  let component: Analysis4;
  let fixture: ComponentFixture<Analysis4>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Analysis4]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Analysis4);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
