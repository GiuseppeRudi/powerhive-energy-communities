import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberOverview } from './member-overview';

describe('MemberOverview', () => {
  let component: MemberOverview;
  let fixture: ComponentFixture<MemberOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberOverview]
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
