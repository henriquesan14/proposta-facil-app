import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { Subject, takeUntil } from 'rxjs';
import { TenantService } from '../../../shared/services/tenant.service';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { TagAtivo } from '../../../shared/components/tag-ativo-inativo/tag-ativo';
import { DatePipe } from '@angular/common';
import { Tenant } from '../../../core/models/tenant.interface';
import { CpfCnpjPipe } from '../../../shared/pipes/cpf-cnpj.pipe';
import { PhonePipe } from '../../../shared/pipes/phone-pipe.pipe';

@Component({
  selector: 'app-tenant-view',
  imports: [NzDescriptionsModule, TagAtivo, DatePipe, CpfCnpjPipe, PhonePipe],
  templateUrl: './tenant-view.html',
  styleUrl: './tenant-view.css'
})
export class TenantView implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  tenant!: Tenant;

  constructor(
    private tenantService: TenantService,
    @Inject(NZ_MODAL_DATA) public data: { tenantId: string }
  ) {}

  ngOnInit(): void {
    this.loadTenant();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTenant(): void {
    this.tenantService.getTenantById(this.data.tenantId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => this.tenant = data
      });
  }
}
