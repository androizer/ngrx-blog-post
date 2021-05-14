import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';

export function ConfirmPasswordValidator(
  pwdControlName: string,
  confirmPwdControlName: string
): ValidatorFn {
  return (formGroup: AbstractControl) => {
    const control = formGroup.get(pwdControlName) as AbstractControl;
    const matchingControl = formGroup.get(
      confirmPwdControlName
    ) as AbstractControl;
    if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
      return null;
    }
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      matchingControl.setErrors(null);
      return null;
    }
  };
}
