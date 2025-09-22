import { AbstractControl, ValidationErrors } from "@angular/forms";

export class ConfirmPasswordValidators {
  static confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    const passwordValue = password.value;
    const confirmPasswordValue = confirmPassword.value;

    // Se senha estiver vazia (edição sem troca), não valida nada
    if (!passwordValue) {
      confirmPassword.setErrors(null);
      return null;
    }

    // Se senha foi preenchida mas confirmação está vazia
    if (passwordValue && !confirmPasswordValue) {
      confirmPassword.setErrors({ required: true });
      confirmPassword?.markAsTouched();
      return { required: true };
    }

    // Se senha e confirmação existem mas não batem
    if (passwordValue !== confirmPasswordValue) {
      confirmPassword.setErrors({ notMatch: true });
      confirmPassword?.markAsTouched();
      return { notMatch: true };
    }

    // Tudo certo
    confirmPassword.setErrors(null);
    return null;
  }
}