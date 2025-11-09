import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Analysis1 } from './analysis1';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideRouter} from '@angular/router';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';

describe('Analysis1', () => {
  let component: Analysis1;
  let fixture: ComponentFixture<Analysis1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Analysis1],
      providers: [provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Analysis1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
