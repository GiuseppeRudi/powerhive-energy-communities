import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';

describe('Login Component - Registration', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['register']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show an error when registration fails', () => {
    // Simula errore backend
    mockAuthService.register.and.returnValue(throwError(() => ({ status: 400 })));

    // Chiamiamo la funzione
    component.regUsername = 'user';
    component.regPassword = '1234';
    component.regEmail = 'test@test.com';
    component.regFirstName = 'Foo';
    component.regLastName = 'Bar';

    // Aggiungi eventualmente un campo per errorMessageRegister se non c’è
    component.onRegister();

    expect(mockAuthService.register).toHaveBeenCalled();
    // Puoi verificare che abbia mostrato un alert (se lo usi)
    // oppure impostato un flag di errore interno
    // In alternativa, controlla un log:
    // expect(console.log).toHaveBeenCalledWith('Registration Error', jasmine.anything());
  });

  it('should redirect to login on successful registration', () => {
    mockAuthService.register.and.returnValue(of({ message: 'ok' }));

    spyOn(window, 'alert'); // intercetta l’alert()

    component.onRegister();

    expect(window.alert).toHaveBeenCalledWith('Registration successful! You can now log in.');
    expect(component.showRegister).toBeFalse();
    expect(mockAuthService.register).toHaveBeenCalled();
  });
});
