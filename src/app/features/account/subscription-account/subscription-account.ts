import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzListModule } from 'ng-zorro-antd/list';
import { SubscriptionAccountResponse } from '../../../core/models/subscription-account-response.interface';
import { AccountService } from '../../../shared/services/account.service';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { PlanChange } from '../plan-change/plan-change';

@Component({
  selector: 'app-subscription-account',
  imports: [NzCardModule, NzTagModule, CurrencyPipe, DatePipe, NzTableModule, NzResultModule, NzButtonModule, NzListModule, CurrencyPipe, NzPaginationModule,
    NzModalModule
  ],
  templateUrl: './subscription-account.html',
  styleUrl: './subscription-account.css'
})
export class SubscriptionAccount implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  data: SubscriptionAccountResponse = <SubscriptionAccountResponse>{
    payments: {}
  };
  loading = false;
  loadingPayment = false;

  constructor(private accountService: AccountService, private modal: NzModalService){}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    var params = {
      pageIndex: this.data.payments.pageIndex,
      pageSize: this.data.payments.pageSize,
    };
    this.accountService.getSubscriptionsAccount(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.data = res;
        }
      });
  }

  onPageChange(event: number): void {
    this.data.payments.pageIndex = event;
    this.loadData();
  }

  onPageSizeChange(event: number){
    this.data.payments.pageSize = event;
    this.loadData();
  }

  openPaymentLink(url: string): void {
    window.open(url, '_blank');
  }

  openChangePlanModal(): void {
    const modal = this.modal.create({
      nzTitle: 'Escolha um novo plano de assinatura',
      nzContent: PlanChange,
      nzWidth: '1000px',
      nzData: {
        plan: this.data.activeSubscription?.subscriptionPlan
      },
      nzFooter: null,
    });

    modal.afterClose.subscribe((result) => {
      if (result) {
        this.loadData();
      }
    });
  }

}
