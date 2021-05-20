import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { noop } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../../core/services';
import { AuthActions } from '../../auth-action.types';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly matSnackbar: MatSnackBar,
    private readonly store: Store
  ) {}

  hide = true;
  formGroup!: FormGroup;

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
      this.authService
        .login(email, password)
        .pipe(
          tap((user) => {
            this.store.dispatch(AuthActions.login({ user }));
            this.router.navigate(['blogs']);
          })
        )
        .subscribe(noop, () => {
          this.matSnackbar.open('Login Failed!', 'OK');
        });
    }
  }
}
