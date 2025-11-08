import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Csv } from './csv';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';

describe('Csv', () => {
  let component: Csv;
  let fixture: ComponentFixture<Csv>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Csv],
      providers: [provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Csv);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
