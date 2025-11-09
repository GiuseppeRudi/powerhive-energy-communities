import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hystory } from './hystory';

describe('Hystory', () => {
  let component: Hystory;
  let fixture: ComponentFixture<Hystory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hystory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Hystory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
