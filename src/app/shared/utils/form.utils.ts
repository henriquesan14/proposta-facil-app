import { AbstractControl, FormGroup } from '@angular/forms';

export class FormUtils {

    static isInvalidAndTouched(form: FormGroup, fieldName: string): boolean {
        const control: AbstractControl | null = form.get(fieldName);
        return !!(
          control &&
          control.invalid &&
          (control.dirty || control.touched)
        );
      }
    
    static markFormGroupTouched(formGroup: FormGroup) {
      Object.values(formGroup.controls).forEach(control => {
        if (control instanceof FormGroup) {
          this.markFormGroupTouched(control); // percorre os filhos
        } else {
          control.markAsTouched();
        }
        control.updateValueAndValidity({ onlySelf: true });
      });
    }
}
