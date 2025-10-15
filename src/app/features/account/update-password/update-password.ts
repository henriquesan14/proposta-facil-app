import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AuthService } from '../../../shared/services/auth.service';
import { UpdatePasswordRequest } from '../../../core/models/update-password-request.interface';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ConfirmPasswordValidators } from '../../../shared/validators/confirm-password.validator';
import { ToastrService } from 'ngx-toastr';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-update-password',
  imports: [NzCardModule, NzFormModule, NzInputModule, ReactiveFormsModule, NzButtonModule, NzIconModule],
  templateUrl: './update-password.html',
  styleUrl: './update-password.css'
})
export class UpdatePassword {
  loading = false;
  showCurrent = false;
  showNew = false;
  showConfirm = false;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      currentPassword: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/(?=.*[A-Z])/), // pelo menos uma maiúscula
          Validators.pattern(/(?=.*[a-z])/), // pelo menos uma minúscula
          Validators.pattern(/(?=.*[0-9])/), // pelo menos um número
          Validators.pattern(/(?=.*[^a-zA-Z0-9])/) // pelo menos um caractere especial
        ]
      ],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: ConfirmPasswordValidators.confirmPasswordValidator
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { currentPassword, password } = this.form.value;
    this.loading = true;

    var updatePassword = <UpdatePasswordRequest>{
      oldPassword: currentPassword,
      newPassword: password
    };
    this.authService.updatePassword(updatePassword).subscribe({
      next: () => {
        this.loading = false;
        this.toastr.success('Senha atualizada com sucesso!', 'Sucesso');
        this.form.reset();
      },
    });
  }
}
