import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call AuthService.login and navigate on success', () => {
    component.email = 'test@example.com';
    component.password = '123456';
    mockAuthService.login.and.returnValue(of({}));
    component.onSubmit();
    expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com', '123456');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/policy']);
    expect(component.loading).toBeFalse();
    expect(component.error).toBeNull();
  });

  it('should set error message on login failure', () => {
    component.email = 'fail@example.com';
    component.password = 'wrong';
    mockAuthService.login.and.returnValue(throwError(() => ({ message: 'Invalid credentials' })));
    component.onSubmit();
    expect(mockAuthService.login).toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Invalid credentials');
  });
});
