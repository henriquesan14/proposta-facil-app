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
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'app-subscription-account',
  imports: [NzCardModule, NzTagModule, CurrencyPipe, DatePipe, NzTableModule, NzResultModule, NzButtonModule, NzListModule, CurrencyPipe, NzPaginationModule],
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

  constructor(private accountService: AccountService, private message: NzMessageService){}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnInit(): void {
    this.loadData();
  }

  loadData(pageIndex = 1){
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
    this.message.info('Funcionalidade de troca de plano em desenvolvimento');
  }

}
