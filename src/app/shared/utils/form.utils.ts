import { FormArray, FormGroup } from '@angular/forms';

export class FormUtils {

    static markFormGroupTouched(formGroup: FormGroup | FormArray) {
      Object.values(formGroup.controls).forEach(control => {
        if (control instanceof FormGroup || control instanceof FormArray) {
          this.markFormGroupTouched(control);
        } else {
          control.markAsTouched();
        }
        control.updateValueAndValidity({ onlySelf: true });
      });
    }
}
