import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Navbar } from './navbar';
import { AuthService } from '../../services/auth/auth.service';
import { of } from 'rxjs';
import { User } from '../../model/User';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideRouter, provideRoutes} from '@angular/router';

describe('Navbar Component', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@test.com',
    first_name: 'Test',
    last_name: 'User',
    plan_id: 1
  };

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['logout'], {
      user$: of(mockUser)
    });

    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [{ provide: AuthService, useValue: mockAuthService }, provideHttpClientTesting(), provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call logout on click', () => {
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });

  it('should update currentUser from user$', () => {
    expect(component.currentUser).toEqual(mockUser);
  });
});
