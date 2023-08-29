import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  isLoading = false;

  constructor(private auth: AuthService) {}

  onSubmit(form: NgForm) {
    const { email, password } = form.value;
    this.isLoading = true;
    this.auth.createUser({ email, password });
  }
}
