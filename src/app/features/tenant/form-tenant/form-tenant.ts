import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NgxMaskDirective } from 'ngx-mask';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ViaCepService } from '../../../shared/services/viacep.service';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { TenantService } from '../../../shared/services/tenant.service';
import { EnderecoViaCep } from '../../../core/models/endereco-viacep.interface';
import { Tenant } from '../../../core/models/tenant.interface';
import { FormUtils } from '../../../shared/utils/form.utils';

@Component({
  selector: 'app-form-tenant',
  imports: [ReactiveFormsModule, NgxMaskDirective, NzButtonModule, NgxSpinnerModule, NzFormModule, NzInputModule, NzRadioModule, NzSelectModule, NzDatePickerModule, NzCheckboxModule],
  templateUrl: './form-tenant.html',
  styleUrl: './form-tenant.css'
})
export class FormTenant implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
    formTenant!: FormGroup;

    constructor(private viaCepService: ViaCepService, private formBuilder: FormBuilder,
      private toastr: ToastrService, private spinnerService: NgxSpinnerService,
      private tenantService: TenantService, private modalRef: NzModalRef, @Inject(NZ_MODAL_DATA) public data: { tenantId: string }){
    }
  
    ngOnInit(): void {
      this.formTenant = this.formBuilder.group({
        name: [null, [Validators.required, Validators.maxLength(100)]],
        tipoPessoa: ['PESSOA_JURIDICA'],
        domain: [null, [Validators.required, Validators.maxLength(100)]],
        document: [null, Validators.required],
        email: [null, [Validators.required, Validators.email]],
        phoneNumber: [null, [Validators.required]],
        address: this.formBuilder.group({
          addressZipCode: [null, [Validators.required]],
          addressStreet: [null, [Validators.required, Validators.maxLength(100)]],
          addressNumber: [null, [Validators.required, Validators.maxLength(10)]],
          addressCity: [null, Validators.required],
          addressState: [null, Validators.required],
          addressDistrict: [null, [Validators.required, Validators.maxLength(100)]],
          addressComplement: [null],
        }),
      });
      if(this.data && this.data.tenantId){
        this.getTenant();
      }
    }
  
    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
  
    getTenant() {
      this.spinnerService.show();
    
      this.tenantService.getTenantById(this.data.tenantId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            
            this.formTenant.get('name')?.setValue(res.name);
            if(this.formTenant.get('tipoPessoa')?.value.length > 11){
              this.formTenant.get('tipoPessoa')?.setValue('PESSOA_JURIDICA');
            }else{
              this.formTenant.get('tipoPessoa')?.setValue('PESSOA_FISICA');
            }
            this.formTenant.get('email')?.setValue(res.email);

            this.formTenant.get('document')?.setValue(res.document);
            this.formTenant.get('phoneNumber')?.setValue(res.phoneNumber);
            this.formTenant.get('domain')?.setValue(res.domain);

            this.formTenant.get('address.addressZipCode')?.setValue(res.addressZipCode);
            this.formTenant.get('address.addressStreet')?.setValue(res.addressCity);
            this.formTenant.get('address.addressNumber')?.setValue(res.addressNumber);
            this.formTenant.get('address.addressComplement')?.setValue(res.addressComplement);
            this.formTenant.get('address.addressDistrict')?.setValue(res.addressDistrict);
            this.formTenant.get('address.addressCity')?.setValue(res.addressCity);
            this.formTenant.get('address.addressState')?.setValue(res.addressState);
            
            this.formTenant.get('address.addressStreet')?.disable();
            this.formTenant.get('address.addressDistrict')?.disable();
            this.formTenant.get('address.addressCity')?.disable();
            this.formTenant.get('address.addressState')?.disable();
          },
          error: () => {
            this.spinnerService.hide();
          },
          complete: () => {
            this.spinnerService.hide();
          }
        });
    }
  
    getCep() {
      const cep = this.formTenant.get('address.addressZipCode')?.value;
      if (cep && cep.length > 7) {
        this.spinnerService.show();
        this.viaCepService.getCep(cep)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (resCep: EnderecoViaCep) => {
              if (resCep.erro) {
                this.toastr.error('Erro ao buscar CEP', 'Error');
                this.spinnerService.hide();
                return;
              }

              this.formTenant.get('address.addressCity')?.setValue(resCep.localidade);
              this.formTenant.get('address.addressCity')?.disable();
              this.formTenant.get('address.addressState')?.setValue(resCep.uf);
              this.formTenant.get('address.addressState')?.disable();

              if(resCep.logradouro?.trim()){
                this.formTenant.get('address.addressStreet')?.setValue(resCep.logradouro);
                this.formTenant.get('address.addressStreet')?.disable();
              }else{
                this.formTenant.get('address.addressStreet')?.enable();
              }

              if(resCep.bairro?.trim()){
                this.formTenant.get('address.addressDistrict')?.setValue(resCep.bairro);
                this.formTenant.get('address.addressDistrict')?.disable();
              }else{
                this.formTenant.get('address.addressDistrict')?.enable();
              }
            },
            error: () => {
              this.spinnerService.hide();
            },
            complete: () => {
              this.spinnerService.hide();
            }
          });
      }
    }
  
    onSubmit(){
      if(this.formTenant.valid){
        const address = this.formTenant.getRawValue().address;
        const form = this.formTenant.value;
        const tenant = <Tenant>{
          name: form.name,
          domain: form.domain,
          email: form.email,
          document: form.document,
          phoneNumber: form.phoneNumber,
          addressZipCode: address.addressZipCode,
          addressStreet: address.addressStreet,
          addressNumber: address.addressNumber,
          addressDistrict: address.addressDistrict,
          addressComplement: address.addressComplement,
          addressCity: address.addressCity,
          addressState: address.addressState
        };
        
      
        if(this.data && this.data.tenantId){
          this.updateCliente(tenant);
        }else{
          this.cadastrarCliente(tenant);
        }
      }else{
        FormUtils.markFormGroupTouched(this.formTenant);
      }
    }
  
    cadastrarCliente(tenant: Tenant){
      this.spinnerService.show();
      this.tenantService.createTenant(tenant).subscribe({
        next: (res) => {
          this.toastr.success('Tenant cadastrado!', 'Sucesso!');
          this.modalRef.close(true);
        },
        error: () => {
          this.spinnerService.hide();
        },
        complete: () => {
          this.spinnerService.hide();
        }
      })
    }
  
    updateCliente(tenant: Tenant){
      this.spinnerService.show();
      tenant.id = this.data.tenantId;
      this.tenantService.updateTenant(tenant).subscribe({
        next: () => {
          this.toastr.success('Tenant atualizado!', 'Sucesso!');
          this.modalRef.close(true);
        },
        error: () => {
          this.spinnerService.hide();
        },
        complete: () => {
          this.spinnerService.hide();
        }
      })
    }
  
    getMaskCpfCnpj(){
      return this.formTenant.get('tipoPessoa')?.value == 'PESSOA_FISICA' ? '000.000.000-00' : '00.000.000/0000-00';
    }
}
