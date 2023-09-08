import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  subscriptions = new Subscription();

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.auth.getAuthStateListener().subscribe((auth) => {
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
    this.auth.createUser({ email, password });
  }
}
