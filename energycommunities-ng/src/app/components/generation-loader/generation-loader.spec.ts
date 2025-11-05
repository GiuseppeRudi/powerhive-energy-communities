import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerationLoader } from './generation-loader';

describe('GenerationLoader', () => {
  let component: GenerationLoader;
  let fixture: ComponentFixture<GenerationLoader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerationLoader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerationLoader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
