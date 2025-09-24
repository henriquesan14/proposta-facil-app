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
      
    }
  
    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
  
    getClient() {
      // this.spinnerService.show();
    
      // this.parteService.getParteById(this.data.parteId)
      //   .pipe(takeUntil(this.destroy$))
      //   .subscribe({
      //     next: (res) => {
      //       // Preenche os campos do formulário com os dados recebidos
      //       this.formPartes.get('nome')?.setValue(res.nome);
      //       this.formPartes.get('tipoPessoa')?.setValue(res.tipoPessoa);
      //       this.formPartes.get('cpfCnpj')?.setValue(res.cpfCnpj);
      //       this.formPartes.get('telefone')?.setValue(res.telefone);
      //       this.formPartes.get('email')?.setValue(res.email);
      //       this.formPartes.get('isCliente')?.setValue(res.isCliente);
    
      //       if (res.dataNascimento) {
      //         this.formPartes.get('dataNascimento')?.setValue(new Date(res.dataNascimento));
      //       }
    
      //       if (res.endereco) {
      //         this.formPartes.get('endereco.cep')?.setValue(res.endereco.cep);
      //         this.formPartes.get('endereco.logradouro')?.setValue(res.endereco.logradouro);
      //         this.formPartes.get('endereco.numero')?.setValue(res.endereco.numero);
      //         this.formPartes.get('endereco.estado')?.setValue(res.endereco.estadoId);
      //         this.formPartes.get('endereco.bairro')?.setValue(res.endereco.bairro);
      //         this.enderecoId = res.endereco.id;
    
      //         // Busca as cidades para preencher o campo de cidade
      //         const estadoId = this.formPartes.get('endereco.estado')?.value;
      //         const cidadeObservable = this.estadoService.getCidades(estadoId);
      //         if (cidadeObservable) {
      //           cidadeObservable.subscribe({
      //             next: (response) => {
      //               this.cidades = response;
      //               this.formPartes.get('endereco.cidade')?.setValue(res.endereco.cidadeId);
      //             },
      //             complete: () => {
      //               this.spinnerService.hide();
      //             },
      //             error: () => {
      //               this.spinnerService.hide();
      //             }
      //           });
      //         } else {
      //           this.spinnerService.hide(); // Caso não haja necessidade de buscar cidades, o spinner é escondido
      //         }
      //       } else {
      //         // Se não houver endereço, esconda o spinner imediatamente
      //         this.spinnerService.hide();
      //       }
      //     },
      //     error: () => {
      //       this.spinnerService.hide();
      //     }
      //   });
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
              }

              if(resCep.bairro?.trim()){
                this.formClient.get('address.addressDistrict')?.setValue(resCep.bairro);
                this.formClient.get('address.addressDistrict')?.disable();
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
        const address = this.formClient.value.address;
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
  
    formatarData(data: Date): string {
      const dataLocal = new Date(data); 
      dataLocal.setMinutes(dataLocal.getMinutes() - dataLocal.getTimezoneOffset()); // Ajusta para o horário local
      return dataLocal.toISOString().split('T')[0]; // "2025-05-02" (sem horário)
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
