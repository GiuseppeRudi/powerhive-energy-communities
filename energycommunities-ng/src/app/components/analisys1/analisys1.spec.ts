import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Analisys1 } from './analisys1';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideRouter} from '@angular/router';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';

describe('Analisys1', () => {
  let component: Analisys1;
  let fixture: ComponentFixture<Analisys1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Analisys1],
      providers: [provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Analisys1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
