import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { AuthActions } from '../../redux/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private readonly store: Store) {}

  hide = true;
  formGroup: FormGroup;

  ngOnInit() {
    this.formGroup = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.maxLength(16),
        Validators.minLength(8),
      ]),
    });
  }

  onFormSubmit() {
    if (this.formGroup.valid) {
      const { email, password } = this.formGroup.value;
      this.store.dispatch(AuthActions.loginRequested({ email, password }));
    }
  }
}
