import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, map } from 'rxjs';
import { Router } from '@angular/router';
import { REGISTER_MUTATION, LOGIN_MUTATION, ME_QUERY } from '../graphql/user.operations';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private apollo: Apollo, private router: Router) {}

  register(name: string, email: string, password: string, role = 'customer') {
    return this.apollo.mutate({
      mutation: REGISTER_MUTATION,
      variables: { input: { name, email, password, role } },
    });
  }

  login(email: string, password: string) {
    return this.apollo.mutate({
      mutation: LOGIN_MUTATION,
      variables: { email, password },
    }).pipe(
      map((res: any) => {
        if (res?.data?.login) {
          localStorage.setItem('token', res.data.login.token);
          localStorage.setItem('role', res.data.login.user.role); 
          this.userSubject.next(res.data.login.user);
        }
        return res.data.login.user;
      })
    );
  }

  loadUser() {
    return this.apollo.watchQuery({ query: ME_QUERY }).valueChanges.pipe(
      map((res: any) => {
        this.userSubject.next(res.data.me);
        return res.data.me;
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.userSubject.next(null);
       localStorage.removeItem('role'); 
    this.router.navigate(['/login']);
  }

  get currentUser() {
    return this.userSubject.value;
  }
}
