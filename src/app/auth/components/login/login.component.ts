import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly matSnackbar: MatSnackBar
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
      this.authService.login(email, password).subscribe(
        () => {
          this.router.navigate(['blogs']);
        },
        () => {
          this.matSnackbar.open('Login Failed!', 'OK');
        }
      );
    }
  }
}
