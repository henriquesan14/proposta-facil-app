import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { UserService } from '../../../shared/services/user.service';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../core/models/user.interface';
import { CreateUser } from '../../../core/models/create-user.interface';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { ConfirmPasswordValidators } from '../../../shared/validators/confirm-password.validator';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-form-user',
  standalone: true,
  imports: [ReactiveFormsModule, NzFormModule, NzSelectModule, NzButtonModule, NzInputModule, NzSpaceModule, NzTooltipModule, NzIconModule, NgxMaskDirective],
  templateUrl: './form-user.component.html',
  styleUrl: './form-user.component.css'
})
export class FormUserComponent implements OnInit, OnDestroy {
    private fb = inject(NonNullableFormBuilder);
    private userService = inject(UserService);
    private toastr = inject(ToastrService);
    private destroy$ = new Subject<void>();
    isSubmitting = false;

    groups: any[] = [
      {
        name: 'AdminTenant',
        value: 2,
      },
      {
        name: 'Sales',
        value: 3,
      },
      {
        name: 'Viewer',
        value: 4,
      }
    ];
  
    constructor(private modalRef: NzModalRef, @Inject(NZ_MODAL_DATA) public data: { userToEdit: User }) {}
  
    userForm!: FormGroup;
  
    ngOnInit(): void {
      this.userForm = this.fb.group({
        name: [null, Validators.required],
        email: [null, [Validators.required, Validators.email]],
        phoneNumber: [null, [Validators.required, Validators.minLength(11)]],
        password: [null, this.data?.userToEdit ? null : [Validators.required, Validators.minLength(6)]],
        confirmPassword: [null, this.data?.userToEdit ? null : [Validators.required]],
        role:['', Validators.required],
      }, {
        validators: ConfirmPasswordValidators.confirmPasswordValidator
      });
      if (this.data?.userToEdit) {
        this.userForm.patchValue({
          name: this.data.userToEdit.name,
          email: this.data.userToEdit.email,
          phoneNumber: this.data.userToEdit.phoneNumber,
          role: this.data.userToEdit.role,
        });
      }
    }

    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
  
    submitForm(): void {
      if (this.userForm.invalid) {
        this.markFormGroupTouched(this.userForm);
        return;
      }
  
      this.isSubmitting = true;

      const payload = this.userForm.value as CreateUser;
  
      if(this.data && this.data.userToEdit){
        this.updateUser(payload);
      }else{
        this.createUser(payload);
      }
    }
  
    createUser(payload: CreateUser){
      this.userService.createUser(payload).subscribe({
        next: () => {
          this.toastr.success('Usuário cadastrado!', 'Sucesso');
          this.resetForm();
          this.modalRef.close(true);
        },
        error: (err) => {
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    }
  
    updateUser(payload: CreateUser){
      payload.id = this.data.userToEdit.id;
      this.userService.updateUser(payload).subscribe({
        next: () => {
          this.toastr.success('Usuário atualizado!', 'Sucesso');
          this.resetForm();
          this.modalRef.close(true);
        },
        error: (err) => {
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    }

    get isEditing(): boolean {
      return !!this.data?.userToEdit;
    }
    
    get passwordLabel(): string {
      return this.isEditing ? 'New Password' : 'Password';
    }
  
    private markFormGroupTouched(formGroup: FormGroup): void {
      Object.values(formGroup.controls).forEach(control => {
        control.markAllAsTouched();
        control.updateValueAndValidity({ onlySelf: true });
      });
    }
    
    private resetForm(){
      this.userForm.reset({
      });
    }
}
