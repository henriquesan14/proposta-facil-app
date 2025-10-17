import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { SubscriptionPlan } from '../../../core/models/subscription-plan.interface';
import { Subject, takeUntil } from 'rxjs';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { SubscriptionPlanService } from '../../../shared/services/subscription-plan.service';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { TagAtivo } from '../../../shared/components/tag-ativo-inativo/tag-ativo';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-subscription-plan-view',
  imports: [NzDescriptionsModule, NzTagModule, TagAtivo, CurrencyPipe, DatePipe],
  templateUrl: './subscription-plan-view.html',
  styleUrl: './subscription-plan-view.css'
})
export class SubscriptionPlanView implements OnInit, OnDestroy{
  private destroy$ = new Subject<void>();
  subscriptionPlan!: SubscriptionPlan;

  constructor(
    private subscriptionPlanService: SubscriptionPlanService,
    @Inject(NZ_MODAL_DATA) public data: { subscriptionPlanId: string }
  ) {}

  ngOnInit(): void {
    this.loadSubscriptionPlan();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSubscriptionPlan(): void {
    this.subscriptionPlanService.getSubscriptionPlanById(this.data.subscriptionPlanId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => this.subscriptionPlan = data
      });
  }
}
