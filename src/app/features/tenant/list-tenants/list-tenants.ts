import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { TenantService } from '../../../shared/services/tenant.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PaginatedResult } from '../../../core/models/paginated-result.interface';
import { Tenant } from '../../../core/models/tenant.interface';
import { BtnNovoComponent } from '../../../shared/components/btn-novo/btn-novo.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NgxMaskDirective } from 'ngx-mask';
import { BtnPesquisarComponent } from '../../../shared/components/btn-pesquisar/btn-pesquisar.component';
import { BtnLimparComponent } from '../../../shared/components/btn-limpar/btn-limpar.component';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTableModule } from 'ng-zorro-antd/table';
import { PhonePipe } from '../../../shared/pipes/phone-pipe.pipe';
import { CpfCnpjPipe } from '../../../shared/pipes/cpf-cnpj.pipe';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { FormTenant } from '../form-tenant/form-tenant';
import { TagAtivo } from '../../../shared/components/tag-ativo-inativo/tag-ativo';
import { TenantView } from '../tenant-view/tenant-view';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { AdminService } from '../../../shared/services/admin.service';
import { LocalstorageService } from '../../../shared/services/local-storage.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-list-tenants',
  imports: [BtnNovoComponent, NzFormModule, ReactiveFormsModule, NzInputModule, NgxMaskDirective, BtnPesquisarComponent, BtnLimparComponent, NzPaginationModule, NzTableModule,
    PhonePipe, CpfCnpjPipe, NzModalModule, NzButtonModule, NzIconModule, NzTooltipModule, TagAtivo, NzSwitchModule
  ],
  templateUrl: './list-tenants.html',
  styleUrl: './list-tenants.css'
})
export class ListTenants implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  confirmModal?: NzModalRef;
  private modal = inject(NzModalService);
  private toastr = inject(ToastrService);
  private message = inject(NzMessageService);
  constructor(private tenantService: TenantService, private adminService: AdminService, private localStorageService: LocalstorageService,
     private formBuilder: FormBuilder, private router: Router) {
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

  paginatedTenants: PaginatedResult<Tenant> = <PaginatedResult<Tenant>>{};
  isLoading = false;

  ngOnInit(): void {
    this.getTenants();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getTenants() {
    var params = {
      pageIndex: this.paginatedTenants.pageIndex,
      pageSize: this.paginatedTenants.pageSize,
      name: this.filtroForm.get('nameFilter')?.value,
      document: this.filtroForm.get('document')?.value,
      onlyActive: this.filtroForm.get('onlyActive')?.value,
    };
    this.isLoading = true;
    this.tenantService.getTenants(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.paginatedTenants = res;
        },
        error: () => {
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
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

  openNewTenantModal(): void {
    const modal = this.modal.create({
      nzTitle: 'Cadastrar tenant',
      nzContent: FormTenant,
      nzWidth: '800px',
      nzFooter: null,
    });

    modal.afterClose.subscribe((result) => {
      if (result) {
        this.getTenants();
      }
    });
  }

  openEditTenantModal(tenant: Tenant): void {
    const modal = this.modal.create({
      nzTitle: 'Editar tenant',
      nzContent: FormTenant,
      nzWidth: '800px',
      nzData: {
        tenantId: tenant.id
      },
      nzFooter: null
    });

    modal.afterClose.subscribe((result) => {
      if (result) {
        this.getTenants();
      }
    });
  }

  openViewTenantModal(tenantId: string): void {
    this.modal.create({
      nzTitle: 'Detalhes do tenant',
      nzContent: TenantView,
      nzWidth: '800px',
      nzData: {
        tenantId
      },
      nzFooter: null
    });
  }

  onPageChange(event: number) {
    this.paginatedTenants.pageIndex = event;
    this.getTenants();
  }

  onPageSizeChange(event: number) {
    this.paginatedTenants.pageSize = event;
    this.getTenants();
  }

  showConfirm(tenant: Tenant): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Exclusão',
      nzContent: `Tem certeza que quer <strong>DESATIVAR</strong> esse tenant?`,
      nzOnOk: () =>
        this.tenantService.deleteTenant(tenant.id).subscribe({
          next: () => {
            this.toastr.success('Tenant desativado!', 'Sucesso');
            this.getTenants();
          }
        })
    });
  }

  impersonate(tenantId: string){
    this.adminService.impersonateTenant(tenantId).subscribe({
      next: (res) => {
        this.message.success('Você entrou no modo de impersonate');
        this.localStorageService.setUserStorage(res);
        this.router.navigate(['/users/list']);
      }
    })
  }

  limpar() {
    this.filtroForm.reset({
      onlyActive: true
    });
  }
}
