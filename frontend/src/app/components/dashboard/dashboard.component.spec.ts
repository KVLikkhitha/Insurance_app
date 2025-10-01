import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardComponent } from './dashboard.component';
import { By } from '@angular/platform-browser';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, RouterTestingModule.withRoutes([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.isLoggedIn).toBeFalse();
    expect(component.admin).toBeFalse();
    expect(component.currentYear).toEqual(new Date().getFullYear());
  });

  it('should set isLoggedIn and admin to true when token and role=admin exist', () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('role', 'admin');

    component.ngOnInit();

    expect(component.isLoggedIn).toBeTrue();
    expect(component.admin).toBeTrue();
  });

  it('should set isLoggedIn true but admin false when role != admin', () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('role', 'user');

    component.ngOnInit();

    expect(component.isLoggedIn).toBeTrue();
    expect(component.admin).toBeFalse();
  });

  it('should clear localStorage and navigate to login on logout', () => {
    spyOn(router, 'navigate');

    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('role', 'admin');
    component.isLoggedIn = true;
    component.admin = true;

    component.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('role')).toBeNull();
    expect(component.isLoggedIn).toBeFalse();
    expect(component.admin).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show logout button only when logged in', () => {
    // initially not logged in
    let logoutBtn = fixture.debugElement.query(
      By.css('[data-testid="logout-btn"]')
    );
    expect(logoutBtn).toBeNull();

    // set logged in
    component.isLoggedIn = true;
    fixture.detectChanges();

    logoutBtn = fixture.debugElement.query(
      By.css('[data-testid="logout-btn"]')
    );
    expect(logoutBtn).toBeTruthy();
    expect(logoutBtn.nativeElement.textContent).toContain('Logout');
  });
});
