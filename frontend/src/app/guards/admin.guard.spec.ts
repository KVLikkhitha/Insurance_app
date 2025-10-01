import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { adminGuard } from './admin.guard';

describe('adminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => adminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
    localStorage.clear();
    spyOn(window, 'alert');
  });

  it('should allow access if role is admin', () => {
    localStorage.setItem('role', 'admin');

    const result = executeGuard({} as any, {} as any);

    expect(result).toBeTrue();
    expect(window.alert).not.toHaveBeenCalled();
  });

  it('should deny access and alert if role is not admin', () => {
    localStorage.setItem('role', 'user');

    const result = executeGuard({} as any, {} as any);

    expect(result).toBeFalse();
    expect(window.alert).toHaveBeenCalledWith('Access denied. Admins only.');
  });

  it('should deny access and alert if role is missing', () => {
    const result = executeGuard({} as any, {} as any);

    expect(result).toBeFalse();
    expect(window.alert).toHaveBeenCalledWith('Access denied. Admins only.');
  });
});
