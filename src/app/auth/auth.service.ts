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
      .post<{ token: string, expiresIn: number }>(`${environment.apiUrl}/user/login`, auth)
      .subscribe(({ token, expiresIn }) => {
        this.token = token;
        if (token) {
          this.authStateListener.next(true);
          this.timer = setTimeout(() => this.logout(), expiresIn);
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
    clearTimeout(this.timer);
  }
}
