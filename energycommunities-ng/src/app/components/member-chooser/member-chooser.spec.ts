import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberChooser } from './member-chooser';

describe('MemberChooser', () => {
  let component: MemberChooser;
  let fixture: ComponentFixture<MemberChooser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberChooser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberChooser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
