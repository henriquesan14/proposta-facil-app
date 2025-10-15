import { Component, inject } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmPasswordValidators } from '../../../shared/validators/confirm-password.validator';
import { ResetPasswordRequest } from '../../../core/models/reset-password-request.interface';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, NzFormModule, NzInputModule, NzButtonModule, NzIconModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  resetForm!: FormGroup;

  loading = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
    this.resetForm = this.fb.group({
      password: [null, [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/(?=.*[A-Z])/), // pelo menos uma maiúscula
        Validators.pattern(/(?=.*[a-z])/), // pelo menos uma minúscula
        Validators.pattern(/(?=.*[0-9])/), // pelo menos um número
        Validators.pattern(/(?=.*[^a-zA-Z0-9])/) // pelo menos um caractere especial
      ]],
      confirmPassword: [null, [Validators.required]],
    }, {
      validators: ConfirmPasswordValidators.confirmPasswordValidator
    });
  }

  onSubmit() {
    if (this.resetForm.valid) {
      this.activateAccount();
    }
  }

  activateAccount() {
    this.loading = true;
    const activate = <ResetPasswordRequest>{
      userId: this.route.snapshot.queryParamMap.get('userId'),
      password: this.resetForm.get('password')?.value,
      token: this.route.snapshot.queryParamMap.get('token')
    };
    this.authService.resetPassword(activate).subscribe({
      next: (res) => {
        this.loading = false;
        this.toastr.success('A Senha foi recuperada', 'Sucesso!');
        return this.router.navigate(['/login']);
      },
      error: () => {
        this.loading = false;
      }
    })
  }
}
