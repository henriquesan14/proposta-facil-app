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

@Component({
  selector: 'app-subscription-account',
  imports: [NzCardModule, NzTagModule, CurrencyPipe, DatePipe, NzTableModule, NzResultModule, NzButtonModule, NzListModule],
  templateUrl: './subscription-account.html',
  styleUrl: './subscription-account.css'
})
export class SubscriptionAccount implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  subscriptionAccount!: SubscriptionAccountResponse;
  subscriptionInactive: boolean = false;

  constructor(private accountService: AccountService){}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnInit(): void {
    this.getSubscription();
  }

  getSubscription(){
    this.accountService.getSubscriptionsAccount()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.subscriptionAccount = res;
        },
        error: (res) => {
          if(res.status == 400){
            this.subscriptionInactive = true;
          }
        }
      });
  }

}
