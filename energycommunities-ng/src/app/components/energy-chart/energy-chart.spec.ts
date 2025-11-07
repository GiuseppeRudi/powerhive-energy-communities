import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyChartComponent } from './energy-chart';
import {provideHttpClientTesting} from '@angular/common/http/testing';

describe('EnergyChartComponent', () => {
  let component: EnergyChartComponent;
  let fixture: ComponentFixture<EnergyChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnergyChartComponent],
      providers: [provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnergyChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
