import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Subscription } from '../../../core/models/subscription.interface';
import { SubscriptionService } from '../../../shared/services/subscription.service';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { TagAtivo } from '../../../shared/components/tag-ativo-inativo/tag-ativo';
import { CommonModule, DatePipe } from '@angular/common';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-subscription-view',
  imports: [NzDescriptionsModule, TagAtivo, DatePipe, NzTagModule, CommonModule],
  templateUrl: './subscription-view.html',
  styleUrl: './subscription-view.css'
})
export class SubscriptionView implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  subscription!: Subscription;

  constructor(
    private subscriptionService: SubscriptionService,
    @Inject(NZ_MODAL_DATA) public data: { subscriptionId: string }
  ) {}

  ngOnInit(): void {
    this.loadSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSubscription(): void {
    this.subscriptionService.getSubscriptionById(this.data.subscriptionId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => this.subscription = data
      });
  }
}
