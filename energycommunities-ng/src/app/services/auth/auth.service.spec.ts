import { TestBed } from '@angular/core/testing';
import {HttpClient, provideHttpClient, withFetch, withInterceptorsFromDi} from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { User } from '../../model/User';
import {Dashboard} from '../../components/dashboard/dashboard';
import {Login} from '../../components/login/login';
import {Navbar} from '../../components/navbar/navbar';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    plan_id: 1,
    first_name: 'Test',
    last_name: 'User'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Navbar, Dashboard, Login],
      providers: [
        AuthService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    sessionStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Should save the user in the sessionStorage after login', () => {
    service.login('testuser', 'password').subscribe(user => {
      expect(user).toEqual(mockUser);
      expect(sessionStorage.getItem('currentUser')).toBe(JSON.stringify(mockUser));
      expect(service.currentUser).toEqual(mockUser);
    });

    const req = httpMock.expectOne('http://localhost:8080/users/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });

  it('should remove the currentUser from sessionStorage after logout', () => {
    sessionStorage.setItem('currentUser', JSON.stringify(mockUser));
    service.logout();

    expect(sessionStorage.getItem('currentUser')).toBeNull();
    expect(service.currentUser).toBeNull();
  });

  it('should initialize reading the user from the sessionStorage', () => {
    sessionStorage.setItem('currentUser', JSON.stringify(mockUser));

    const newService = new AuthService(TestBed.inject(HttpClient));
    expect(newService.currentUser).toEqual(mockUser);
  });
});
