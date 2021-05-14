import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services';

import { ConfirmPasswordValidator } from './confirm-password.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private readonly renderer2: Renderer2,
    private readonly authService: AuthService,
    private readonly matSnackbar: MatSnackBar,
    private readonly router: Router
  ) {}

  @ViewChild('avatar') avatarWrapper!: ElementRef;

  hidePassword = true;
  hideConfirmPassword = true;
  formGroup!: FormGroup;

  ngOnInit(): void {
    this.formGroup = new FormGroup(
      {
        avatar: new FormControl(null),
        firstName: new FormControl(null, [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(8),
        ]),
        lastName: new FormControl(null, [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(8),
        ]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
        ]),
        confirmPassword: new FormControl(null),
      },
      {
        validators: ConfirmPasswordValidator('password', 'confirmPassword'),
      }
    );
  }

  onAvatarChange(evt: any) {
    const files = evt.target.files as FileList;
    const file = files[0];
    this.formGroup.get('avatar')?.setValue(file);
    const reader = new FileReader();
    reader.onload = (evt) => {
      this.setAvatar(`url(${evt.target?.result})`);
      this.formGroup.get('avatar')?.setValue(file);
    };
    reader.readAsDataURL(file);
  }

  setAvatar(base64Url: string) {
    this.renderer2.setStyle(
      this.avatarWrapper.nativeElement,
      'background-image',
      base64Url
    );
  }

  onFormSubmit() {
    if (this.formGroup.valid) {
      const user = this.formGroup.value;
      const fd = new FormData();
      fd.append('avatar', user.avatar);
      fd.append('firstName', user.firstName);
      fd.append('lastName', user.lastName);
      fd.append('email', user.email);
      fd.append('password', user.password);
      this.authService.register(fd).subscribe(
        () => {
          this.matSnackbar.open('Registration Successful!', 'OK');
          this.router.navigate(['/auth/login']);
        },
        (err) => this.matSnackbar.open(err.message, 'OK')
      );
    }
  }
}
