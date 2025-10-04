import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../shared/services/auth.service';
import { ForgotPasswordRequest } from '../../../core/models/forgot-password-request.interface';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Location } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, NzFormModule, NzInputModule, NzButtonModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  forgotForm!: FormGroup;

  loading = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private location: Location) {
    this.forgotForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.forgotForm.valid) {
      this.forgotPassword();
    }
  }

  forgotPassword() {
    this.loading = true;
    const forgotPassword = <ForgotPasswordRequest>{
      email: this.forgotForm.get('email')?.value,
    };
    this.authService.forgotPassword(forgotPassword).subscribe({
      next: (res) => {
        this.loading = false;
        this.toastr.success('Email de recuperação de senha enviado', 'Sucesso!');
        return this.router.navigate(['/login']);
      },
      error: () => {
        this.loading = false;
      }
    })
  }

  back(){
    this.location.back();
  }
}
