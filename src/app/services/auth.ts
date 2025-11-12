import { Injectable, signal, computed, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';

export interface SignInInput {
  email: string;
  password: string;
}

export interface SignUpInput {
  username: string;
  email: string;
  role: string;
  password: string;
}

export interface AuthPayload {
  userId: string;
  role: string;
  accessToken: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

const SIGN_IN_MUTATION = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      userId
      role
      accessToken
    }
  }
`;

const SIGN_UP_MUTATION = gql`
  mutation SignUp($input: CreateUserInput!) {
    signUp(input: $input) {
      id
      username
      email
      role
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'jwt_token';
  private readonly USER_KEY = 'user_data';
  
  private authState = signal<{ userId: string; role: string } | null>(this.loadAuthState());
  
  isAuthenticated = computed(() => this.authState() !== null);
  currentUser = computed(() => this.authState());
  
  private apollo = inject(Apollo);
  private router = inject(Router);

  constructor() {}

  signIn(input: SignInInput) {
    return this.apollo.mutate<{ signIn: AuthPayload }>({
      mutation: SIGN_IN_MUTATION,
      variables: { input }
    }).pipe(
      map(result => {
        if (!result.data) return null;
        return result.data.signIn;
      }),
      tap(authPayload => {
        if (authPayload) {
          this.setSession(authPayload);
        }
      })
    );
  }

  signUp(input: SignUpInput) {
    return this.apollo.mutate<{ signUp: User }>({
      mutation: SIGN_UP_MUTATION,
      variables: { input }
    }).pipe(
      map(result => {
        if (!result.data) return null;
        return result.data.signUp;
      })
    );
  }

  private setSession(authPayload: AuthPayload): void {
    localStorage.setItem(this.TOKEN_KEY, authPayload.accessToken);
    const userData = {
      userId: authPayload.userId,
      role: authPayload.role
    };
    localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
    this.authState.set(userData);
  }

  private loadAuthState(): { userId: string; role: string } | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userData = localStorage.getItem(this.USER_KEY);
    
    if (token && userData) {
      return JSON.parse(userData);
    }
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  signOut(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.authState.set(null);
    this.router.navigate(['/sign-in']);
  }

  hasRole(role: string): boolean {
    const user = this.authState();
    return user?.role === role;
  }
}
