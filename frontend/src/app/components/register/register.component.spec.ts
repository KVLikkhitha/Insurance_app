import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

class MockAuthService {
  register = jasmine.createSpy('register').and.returnValue(of({}));
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: MockAuthService;
  let router: MockRouter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    router = TestBed.inject(Router) as unknown as MockRouter;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render form inputs and button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('input[name="name"]')).toBeTruthy();
    expect(compiled.querySelector('input[name="email"]')).toBeTruthy();
    expect(compiled.querySelector('input[name="password"]')).toBeTruthy();
    expect(compiled.querySelector('select[name="role"]')).toBeTruthy();
    expect(compiled.querySelector('button[type="submit"]')?.textContent).toContain('Register');
  });

  it('should call AuthService.register and navigate on success', () => {
    component.name = 'John';
    component.email = 'john@example.com';
    component.password = 'secret';
    component.role = 'customer';

    component.onSubmit();

    expect(authService.register).toHaveBeenCalledWith(
      'John',
      'john@example.com',
      'secret',
      'customer'
    );
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should set error message on registration failure', () => {
    (authService.register as jasmine.Spy).and.returnValue(
      throwError(() => ({ message: 'Registration failed' }))
    );

    component.onSubmit();

    expect(component.error).toBe('Registration failed');
    expect(component.loading).toBeFalse();
  });

  it('should disable button when loading is true', () => {
    component.loading = true;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBeTrue();
  });

  it('should display error message in template when error is set', () => {
    component.error = 'Registration failed';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const errorElement = compiled.querySelector('p.text-red-600');
    expect(errorElement).toBeTruthy();
    expect(errorElement?.textContent).toContain('Registration failed');
  });

  it('should update component properties when inputs change (ngModel binding)', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    const nameInput = compiled.querySelector('input[name="name"]') as HTMLInputElement;
    nameInput.value = 'Alice';
    nameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.name).toBe('Alice');
  });
});
