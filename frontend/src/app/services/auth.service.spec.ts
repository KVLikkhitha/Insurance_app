import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { REGISTER_MUTATION, LOGIN_MUTATION, ME_QUERY } from '../graphql/user.operations';

class MockApollo {
  mutate = jasmine.createSpy().and.returnValue(of({}));
  watchQuery = jasmine.createSpy().and.returnValue({
    valueChanges: of({ data: { me: { id: 1, name: 'Test User' } } }),
  });
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('AuthService', () => {
  let service: AuthService;
  let apollo: MockApollo;
  let router: MockRouter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Apollo, useClass: MockApollo },
        { provide: Router, useClass: MockRouter },
      ],
    });

    service = TestBed.inject(AuthService);
    apollo = TestBed.inject(Apollo) as unknown as MockApollo;
    router = TestBed.inject(Router) as unknown as MockRouter;
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call apollo.mutate when registering', () => {
    service.register('John', 'john@example.com', 'secret', 'customer').subscribe();

    expect(apollo.mutate).toHaveBeenCalledWith({
      mutation: REGISTER_MUTATION,
      variables: {
        input: { name: 'John', email: 'john@example.com', password: 'secret', role: 'customer' },
      },
    });
  });

  it('should call apollo.mutate and store token + role when logging in', () => {
    const mockResponse = {
      data: {
        login: {
          token: 'abc123',
          user: { id: 1, name: 'John', role: 'customer' },
        },
      },
    };

    (apollo.mutate as jasmine.Spy).and.returnValue(of(mockResponse));

    service.login('john@example.com', 'secret').subscribe((user) => {
      expect(user).toEqual({ id: 1, name: 'John', role: 'customer' });
    });

    expect(localStorage.getItem('token')).toBe('abc123');
    expect(localStorage.getItem('role')).toBe('customer');
    expect(service.currentUser).toEqual({ id: 1, name: 'John', role: 'customer' });
  });

  it('should load user with ME_QUERY', () => {
    service.loadUser().subscribe((user) => {
      expect(user).toEqual({ id: 1, name: 'Test User' });
    });

    expect(apollo.watchQuery).toHaveBeenCalledWith({ query: ME_QUERY });
  });

  it('should clear localStorage and navigate on logout', () => {
    localStorage.setItem('token', 'abc123');
    localStorage.setItem('role', 'customer');

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('role')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(service.currentUser).toBeNull();
  });
});
