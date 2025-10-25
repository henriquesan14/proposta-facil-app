import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormUtils } from '../../../shared/utils/form.utils';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ViaCepService } from '../../../shared/services/viacep.service';
import { ToastrService } from 'ngx-toastr';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { ClientService } from '../../../shared/services/client.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { EnderecoViaCep } from '../../../core/models/endereco-viacep.interface';
import { Client } from '../../../core/models/client.interface';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NgxMaskDirective } from 'ngx-mask';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

@Component({
  standalone: true,
  selector: 'app-form-client',
  imports: [ReactiveFormsModule, NgxMaskDirective, NzButtonModule, NgxSpinnerModule, NzFormModule, NzInputModule, NzRadioModule, NzSelectModule, NzDatePickerModule, NzCheckboxModule],
  templateUrl: './form-client.html',
  styleUrl: './form-client.css'
})
export class FormClient implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
    formClient!: FormGroup;

    constructor(private viaCepService: ViaCepService, private formBuilder: FormBuilder,
      private toastr: ToastrService, private spinnerService: NgxSpinnerService,
      private clientService: ClientService, private modalRef: NzModalRef, @Inject(NZ_MODAL_DATA) public data: { clientId: string }){
    }
  
    ngOnInit(): void {
      this.formClient = this.formBuilder.group({
        name: [null, [Validators.required, Validators.maxLength(100)]],
        tipoPessoa: ['PESSOA_FISICA'],
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
      if(this.data && this.data.clientId){
        this.getClient();
      }
    }
  
    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
  
    getClient() {
      this.spinnerService.show();
    
      this.clientService.getClientById(this.data.clientId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          
          this.formClient.get('name')?.setValue(res.name);
          if(res.document.length > 11){
            this.formClient.get('tipoPessoa')?.setValue('PESSOA_JURIDICA');
          }else{
            this.formClient.get('tipoPessoa')?.setValue('PESSOA_FISICA');
          }
          this.formClient.get('email')?.setValue(res.email);

          this.formClient.get('document')?.setValue(res.document);
          this.formClient.get('phoneNumber')?.setValue(res.phoneNumber);

          this.formClient.get('address.addressZipCode')?.setValue(res.addressZipCode);
          this.formClient.get('address.addressStreet')?.setValue(res.addressCity);
          this.formClient.get('address.addressNumber')?.setValue(res.addressNumber);
          this.formClient.get('address.addressComplement')?.setValue(res.addressComplement);
          this.formClient.get('address.addressDistrict')?.setValue(res.addressDistrict);
          this.formClient.get('address.addressCity')?.setValue(res.addressCity);
          this.formClient.get('address.addressState')?.setValue(res.addressState);
          
          this.formClient.get('address.addressStreet')?.disable();
          this.formClient.get('address.addressDistrict')?.disable();
          this.formClient.get('address.addressCity')?.disable();
          this.formClient.get('address.addressState')?.disable();
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
      const cep = this.formClient.get('address.addressZipCode')?.value;
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

              this.formClient.get('address.addressCity')?.setValue(resCep.localidade);
              this.formClient.get('address.addressCity')?.disable();
              this.formClient.get('address.addressState')?.setValue(resCep.uf);
              this.formClient.get('address.addressState')?.disable();

              if(resCep.logradouro?.trim()){
                this.formClient.get('address.addressStreet')?.setValue(resCep.logradouro);
                this.formClient.get('address.addressStreet')?.disable();
              }else{
                this.formClient.get('address.addressStreet')?.enable();
              }

              if(resCep.bairro?.trim()){
                this.formClient.get('address.addressDistrict')?.setValue(resCep.bairro);
                this.formClient.get('address.addressDistrict')?.disable();
              }else{
                this.formClient.get('address.addressDistrict')?.enable();
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
      if(this.formClient.valid){
        const address = this.formClient.getRawValue().address;
        const form = this.formClient.value;
        const client = <Client>{
          name: form.name,
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
        
      
        if(this.data && this.data.clientId){
          this.updateCliente(client);
        }else{
          this.cadastrarCliente(client);
        }
      }else{
        FormUtils.markFormGroupTouched(this.formClient);
      }
    }
  
    cadastrarCliente(client: Client){
      this.spinnerService.show();
      this.clientService.createClient(client).subscribe({
        next: (res) => {
          this.toastr.success('Cliente cadastrado!', 'Sucesso!');
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
  
    updateCliente(client: Client){
      this.spinnerService.show();
      client.id = this.data.clientId;
      this.clientService.updateClient(client).subscribe({
        next: () => {
          this.toastr.success('Cliente atualizado!', 'Sucesso!');
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
      return this.formClient.get('tipoPessoa')?.value == 'PESSOA_FISICA' ? '000.000.000-00' : '00.000.000/0000-00';
    }
}
