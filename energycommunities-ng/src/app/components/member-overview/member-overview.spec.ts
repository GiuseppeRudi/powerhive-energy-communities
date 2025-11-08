import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberOverview } from './member-overview';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideRouter} from '@angular/router';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';

describe('MemberOverview', () => {
  let component: MemberOverview;
  let fixture: ComponentFixture<MemberOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberOverview],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
