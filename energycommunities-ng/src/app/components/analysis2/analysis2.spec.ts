import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Analysis2 } from './analysis2';

describe('Analysis2', () => {
  let component: Analysis2;
  let fixture: ComponentFixture<Analysis2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Analysis2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Analysis2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
