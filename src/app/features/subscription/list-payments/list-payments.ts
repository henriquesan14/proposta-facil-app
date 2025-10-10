import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { SubscriptionService } from '../../../shared/services/subscription.service';
import { Payment } from '../../../core/models/payment.interface';
import { PaginatedResult } from '../../../core/models/paginated-result.interface';
import { Subject, takeUntil } from 'rxjs';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-list-payments',
  imports: [NzPaginationModule, NzTableModule, CurrencyPipe, DatePipe, NzTagModule, CommonModule, NzButtonModule, NzIconModule, NzTooltipModule],
  templateUrl: './list-payments.html',
  styleUrl: './list-payments.css'
})
export class ListPayments implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    paginatedPayment: PaginatedResult<Payment> = <PaginatedResult<Payment>>{};
    loading = false;

    constructor(private subscriptionService: SubscriptionService, @Inject(NZ_MODAL_DATA) public data: { subscriptionId: string }){}

    ngOnInit(): void {
      this.loadPayments();
    }

    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }

    loadPayments() {
      if (!this.data.subscriptionId) return;
      this.loading = true;

      this.subscriptionService.getPayments(this.data.subscriptionId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            this.paginatedPayment = res;
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          }
        });
    }

  onPageChange(event: number) {
    this.paginatedPayment.pageIndex = event;
    this.loadPayments();
  }

  onPageSizeChange(event: number) {
    this.paginatedPayment.pageSize = event;
    this.loadPayments();
  }

  openPayment(paymentLink: string){
    window.open(paymentLink, '_blank');
  }
  
}
