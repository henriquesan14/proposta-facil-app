import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ClientService } from '../../../shared/services/client.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Client } from '../../../core/models/client.interface';
import { PaginatedResult } from '../../../core/models/paginated-result.interface';
import { BtnNovoComponent } from '../../../shared/components/btn-novo/btn-novo.component';
import { BtnPesquisarComponent } from '../../../shared/components/btn-pesquisar/btn-pesquisar.component';
import { BtnLimparComponent } from '../../../shared/components/btn-limpar/btn-limpar.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { CpfCnpjPipe } from '../../../shared/pipes/cpf-cnpj.pipe';
import { PhonePipe } from '../../../shared/pipes/phone-pipe.pipe';
import { NgxMaskDirective } from 'ngx-mask';
import { FormClient } from '../form-client/form-client';
import { TagAtivo } from '../../../shared/components/tag-ativo-inativo/tag-ativo';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { ClientView } from '../client-view/client-view';

@Component({
  selector: 'app-list-client',
  standalone: true,
  imports: [BtnNovoComponent, BtnPesquisarComponent, BtnLimparComponent, ReactiveFormsModule, NzFormModule, NzInputModule, NzPaginationModule, NzTableModule, NzIconModule, NzModalModule, NzButtonModule,
    NzTooltipModule, CpfCnpjPipe, PhonePipe, NgxMaskDirective, TagAtivo, NzSwitchModule
   ],
  templateUrl: './list-client.html',
  styleUrl: './list-client.css'
})
export class ListClient implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
    confirmModal?: NzModalRef;
    private modal = inject(NzModalService);
    private toastr = inject(ToastrService);
    constructor(private clientService: ClientService, private formBuilder: FormBuilder){
      this.filtroForm = this.formBuilder.group({
        nameFilter: [null],
        document: [''],
        onlyActive: [true]
      });

      this.filtroForm.get('document')?.valueChanges.subscribe(value => {
        this.onInputChange(value);
      });
    }
    filtroForm!: FormGroup;
    mask: string = '';
    paginatedClients: PaginatedResult<Client> = <PaginatedResult<Client>>{};

    ngOnInit(): void {
      this.getClients();
    }
  
    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
  
    getClients(){
      var params = {
        pageIndex: this.paginatedClients.pageIndex,
        pageSize: this.paginatedClients.pageSize,
        name: this.filtroForm.get('nameFilter')?.value,
        document: this.filtroForm.get('document')?.value,
        onlyActive: this.filtroForm.get('onlyActive')?.value
      };
      this.clientService.getClients(params)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            this.paginatedClients = res;
          }
        })
    }

    onInputChange(value: string): void {
      if (value && value.length <= 11) {
        this.mask = '000.000.000-009'; // CPF
      } else {
        this.mask = '00.000.000/0000-00'; // CNPJ
      }
    }
  
    openNewClientModal(): void {
      const modal = this.modal.create({
        nzTitle: 'Cadastrar cliente',
        nzContent: FormClient,
        nzWidth: '800px',
        nzFooter: null,
      });
  
      modal.afterClose.subscribe((result) => {
        if (result) {
          this.getClients();
        }
      });
    }
  
    openEditClientModal(client: Client): void {
      const modal = this.modal.create({
        nzTitle: 'Editar cliente',
        nzContent: FormClient,
        nzWidth: '800px',
        nzData:{
          clientId: client.id
        },
        nzFooter: null
      });
      
      modal.afterClose.subscribe((result) => {
        if (result) {
          this.getClients();
        }
      });
    }

    openViewClientModal(clientId: string): void {
      this.modal.create({
        nzTitle: 'Detalhes do cliente',
        nzContent: ClientView,
        nzWidth: '800px',
        nzData: {
          clientId
        },
        nzFooter: null,
      });
    }

    onPageChange(event: number){
      this.paginatedClients.pageIndex = event;
      this.getClients();
    }

    onPageSizeChange(event: number){
      this.paginatedClients.pageSize = event;
      this.getClients();
    }
  
    showConfirm(id: string): void {
      this.confirmModal = this.modal.confirm({
        nzTitle: 'Exclusão',
        nzContent: 'Tem certeza que quer <strong>DESATIVAR</strong> este cliente?',
        nzOnOk: () =>
          this.clientService.deleteClient(id).subscribe({
            next: () => {
              this.toastr.success('Cliente desativado!', 'Sucesso');
              this.getClients();
            }
          })
      });
    }

    limpar(){
      this.filtroForm.reset({
        onlyActive: true
      });
    }
}
