import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { SubscriptionService } from '../../../shared/services/subscription.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PaginatedResult } from '../../../core/models/paginated-result.interface';
import { Subscription } from '../../../core/models/subscription.interface';
import { BtnNovoComponent } from '../../../shared/components/btn-novo/btn-novo.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { BtnPesquisarComponent } from '../../../shared/components/btn-pesquisar/btn-pesquisar.component';
import { BtnLimparComponent } from '../../../shared/components/btn-limpar/btn-limpar.component';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { SubscriptionPlanService } from '../../../shared/services/subscription-plan.service';
import { SubscriptionPlan } from '../../../core/models/subscription-plan.interface';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormSubscription } from '../form-subscription/form-subscription';
import { ListPayments } from '../list-payments/list-payments';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-list-subscriptions',
  imports: [BtnNovoComponent, NzFormModule, ReactiveFormsModule, NzInputModule, NzSelectModule, BtnPesquisarComponent, BtnLimparComponent, NzPaginationModule, NzTableModule,
    DatePipe, CurrencyPipe, NzModalModule, NzButtonModule, NzIconModule, NzTooltipModule, NzDatePickerModule, NzTagModule, CommonModule
  ],
  templateUrl: './list-subscriptions.html',
  styleUrl: './list-subscriptions.css',
  providers: [DatePipe]
})
export class ListSubscriptions implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  confirmModal?: NzModalRef;
  private modal = inject(NzModalService);
  private toastr = inject(ToastrService);
  constructor(private subscriptionService: SubscriptionService, private subscriptionPlanService: SubscriptionPlanService, private formBuilder: FormBuilder, private datePipe: DatePipe) {
    this.filtroForm = this.formBuilder.group({
      tenantFilter: [null],
      planFilter: [''],
      statusFilter: [''],
      dateRange: [null]
    });
  }
  filtroForm!: FormGroup;
  subscriptionStatus = ['Pending','Active', 'Suspended', 'Canceled','Expired'];

  paginatedSubscriptions: PaginatedResult<Subscription> = <PaginatedResult<Subscription>>{};
  subscriptionPlans: SubscriptionPlan[] = [];

  ngOnInit(): void {
    this.getSubscriptions();
    this.getSubscriptionPlans(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getSubscriptionPlans(params: any){
    this.subscriptionPlanService.getSubscriptionPlans(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.subscriptionPlans = res;
        }
      })
  }

  getSubscriptions() {
    const { dateRange } = this.filtroForm.value;
    var params = {
      pageIndex: this.paginatedSubscriptions.pageIndex,
      pageSize: this.paginatedSubscriptions.pageSize,
      tenantName: this.filtroForm.get('tenantFilter')?.value,
      subscriptionPlanId: this.filtroForm.get('planFilter')?.value,
      status: this.filtroForm.get('statusFilter')?.value,
      startDate: dateRange ? this.datePipe.transform((dateRange as Date[])[0], "yyyy-MM-dd") : null,
      endDate: dateRange ? this.datePipe.transform((dateRange as Date[])[1], "yyyy-MM-dd") : null
    };
    this.subscriptionService.getSubscriptions(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.paginatedSubscriptions = res;
        }
      })
  }

  openNewSubscriptionModal(): void {
    const modal = this.modal.create({
      nzTitle: 'Cadastrar assinatura',
      nzContent: FormSubscription,
      nzWidth: '800px',
      nzFooter: null,
    });

    modal.afterClose.subscribe((result) => {
      if (result) {
        this.getSubscriptions();
      }
    });
  }

  openEditSubscriptionModal(subscription: Subscription): void {
    // const modal = this.modal.create({
    //   nzTitle: 'Editar tenant',
    //   nzContent: FormTenant,
    //   nzWidth: '800px',
    //   nzData: {
    //     tenantId: tenant.id
    //   },
    //   nzFooter: null
    // });

    // modal.afterClose.subscribe((result) => {
    //   if (result) {
    //     this.getTenants();
    //   }
    // });
  }

  openListPayments(subscriptionId: string){
    const modal = this.modal.create({
      nzTitle: 'Pagamentos',
      nzContent: ListPayments,
      nzWidth: '800px',
      nzData: {
        subscriptionId
      },
      nzFooter: null,
    });

    modal.afterClose.subscribe((result) => {
      if (result) {
        this.getSubscriptions();
      }
    });
  }

  onPageChange(event: number) {
    this.paginatedSubscriptions.pageIndex = event;
    this.getSubscriptions();
  }

  onPageSizeChange(event: number) {
    this.paginatedSubscriptions.pageSize = event;
    this.getSubscriptions();
  }

  showConfirm(id: string): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Exclusão',
      nzContent: 'Tem certeza que quer remover esta assinatura?',
      nzOnOk: () =>
        this.subscriptionService.deleteSubscription(id).subscribe({
          next: () => {
            this.toastr.success('Assinatura removida!', 'Sucesso');
            this.getSubscriptions();
          }
        })
    });
  }

  limpar() {
    this.filtroForm.reset();
    this.filtroForm.get('planFilter')?.setValue('');
    this.filtroForm.get('statusFilter')?.setValue('');
  }
}
