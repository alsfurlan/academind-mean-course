import { Injectable } from '@angular/core';
import { AuthInterface } from './auth.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  createUser(auth: AuthInterface) {
    this.httpClient
      .post(`${environment.apiUrl}/user/signup`, auth)
      .subscribe((response) => {
        console.log(response);
      });
  }

  login(auth: AuthInterface) {
    this.httpClient
      .post(`${environment.apiUrl}/user/login`, auth)
      .subscribe((response) => {
        console.log(response);
      });
  }
}
