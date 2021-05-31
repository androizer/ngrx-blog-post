import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { ComponentBase } from '../../../core/components/component-base';

import { AuthActions } from '../../auth-action.types';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends ComponentBase implements OnInit {
  constructor(
    private readonly store: Store,
    private readonly actionSub: ActionsSubject,
    private readonly router: Router
  ) {
    super();
    this._subscriptions.push(
      this.actionSub.pipe(ofType(AuthActions.saveUser)).subscribe(() => {
        this.router.navigate(['/blogs']);
      })
    );
  }

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
      this.store.dispatch(AuthActions.login({ email, password }));
    }
  }
}
