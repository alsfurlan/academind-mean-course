import { Injectable } from '@angular/core';
import { AuthInterface } from './auth.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string;
  private authStateListener = new BehaviorSubject<boolean>(false);
  private timer: any;
  constructor(private httpClient: HttpClient, private router: Router) {}

  getAuthStateListener() {
    return this.authStateListener.asObservable();
  }

  createUser(auth: AuthInterface) {
    this.httpClient
      .post(`${environment.apiUrl}/user/signup`, auth)
      .subscribe((response) => {
        console.log(response);
      });
  }

  login(auth: AuthInterface) {
    this.httpClient
      .post<{ token: string; expiresIn: number }>(
        `${environment.apiUrl}/user/login`,
        auth
      )
      .subscribe(({ token, expiresIn }) => {
        this.token = token;
        if (token) {
          this.authStateListener.next(true);
          const expiresInMilliseconds = expiresIn * 1000;
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInMilliseconds - (now.getTimezoneOffset() * 60000)
          );
          this.setAuthTimer(expiresInMilliseconds);
          this.saveAuthData(token, expirationDate);
          this.router.navigate(['']);
        }
      });
  }

  getToken() {
    return this.token;
  }

  logout() {
    this.token = undefined;
    this.authStateListener.next(false);
    this.router.navigate(['']);
    this.clearAuthData();
    this.clearAuthTimer();
  }

  initAuthData() {
    const authInformation = this.getAuthData();
    if (!authInformation) return;
    const { token, expirationDate } = authInformation;
    const now = new Date();
    const expiresIn = expirationDate.getTime() - now.getTime() + (now.getTimezoneOffset() * 60000);
    if (expiresIn > 0) {
      this.token = token;
      this.authStateListener.next(true);
      this.setAuthTimer(expiresIn);
    } else {
      this.clearAuthData();
    }
  }

  private setAuthTimer(duration: number) {
    this.timer = setTimeout(() => this.logout(), duration);
  }

  private clearAuthTimer() {
    clearTimeout(this.timer);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    if (token && expiration) {
      return {
        token,
        expirationDate: new Date(expiration),
      };
    }
  }
}
