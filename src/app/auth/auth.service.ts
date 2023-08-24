import { Injectable } from '@angular/core';
import { AuthInterface } from './auth.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string;
  private authStateListener = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient) {}

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
      .post<{ token: string }>(`${environment.apiUrl}/user/login`, auth)
      .subscribe(({ token }) => {
        this.token = token;
        if (token) this.authStateListener.next(true);
      });
  }

  getToken() {
    return this.token;
  }

  logout() {
    this.token = undefined;
    this.authStateListener.next(false);
  }
}
