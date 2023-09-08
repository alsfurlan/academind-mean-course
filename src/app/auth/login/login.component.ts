import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  subscriptions = new Subscription();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.authService.getAuthStateListener().subscribe((auth) => {
        this.isLoading = false;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onSubmit(form: NgForm) {
    const { email, password } = form.value;
    this.isLoading = true;
    this.authService.login({
      email,
      password,
    });
  }
}
