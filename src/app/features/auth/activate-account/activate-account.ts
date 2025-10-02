import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AuthService } from '../../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmPasswordValidators } from '../../../shared/validators/confirm-password.validator';
import { ToastrService } from 'ngx-toastr';
import { ActivateAccountRequest } from '../../../core/models/activate-account-request.interface';

@Component({
  selector: 'app-activate-account',
  imports: [NzFormModule, ReactiveFormsModule, NzInputModule, NzButtonModule, NzCardModule, NzIconModule, NzInputModule],
  templateUrl: './activate-account.html',
  styleUrl: './activate-account.css'
})
export class ActivateAccount {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  activateForm!: FormGroup;

  loading = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
    this.activateForm = this.fb.group({
      password: [null, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [null, [Validators.required]],
    }, {
      validators: ConfirmPasswordValidators.confirmPasswordValidator
    });
  }

  onSubmit() {
    if (this.activateForm.valid) {
      this.activateAccount();
    }
  }

  activateAccount() {
    this.loading = true;
    const activate = <ActivateAccountRequest>{
      password: this.activateForm.get('password')?.value,
      token: this.route.snapshot.queryParamMap.get('token')
    };
    this.authService.activateAccount(activate).subscribe({
      next: (res) => {
        this.loading = false;
        this.toastr.success('Conta ativada com sucesso', 'Sucesso!');
        return this.router.navigate(['/login']);
      },
      error: () => {
        this.loading = false;
      }
    })
  }
}
