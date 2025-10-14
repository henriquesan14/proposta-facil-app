import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SubscriptionPlanService } from '../../../shared/services/subscription-plan.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AccountService } from '../../../shared/services/account.service';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { SubscriptionPlan } from '../../../core/models/subscription-plan.interface';

@Component({
  selector: 'app-plan-change',
  imports: [NzPageHeaderModule, NzSpinModule, NzCardModule, CommonModule, NzButtonModule, NzGridModule, NzRadioModule, FormsModule],
  templateUrl: './plan-change.html',
  styleUrl: './plan-change.css'
})
export class PlanChange implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  plans: any[] = [];
  loading = false;
  selectedPlan: SubscriptionPlan | null = null;
  selectedBillingType: string | null = null;
  loadingSelect: string | null = null;
  confirming = false;

  constructor(
    private subscriptionPlanService: SubscriptionPlanService,
    private accountService: AccountService,
    private message: NzMessageService,
    private modal: NzModalRef,
    @Inject(NZ_MODAL_DATA) public data: { plan: SubscriptionPlan }
  ) { }

  ngOnInit(): void {
    this.loadPlans();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPlans(): void {
    this.loading = true;
    this.subscriptionPlanService.getSubscriptionPlans(null).subscribe({
      next: (res) => {
        this.plans = res;
        this.loading = false;
      },
      error: () => {
        this.message.error('Erro ao carregar planos');
        this.loading = false;
      },
    });
  }

  isCurrentPlan(planId: string): boolean {
    return this.data.plan.id === planId;
  }

  selectPlan(plan: SubscriptionPlan) {
    this.selectedPlan = plan;
    this.selectedBillingType = null;
  }

  cancelSelection() {
    this.selectedPlan = null;
    this.selectedBillingType = null;
  }

  confirmChangePlan() {
    if (!this.selectedPlan || !this.selectedBillingType) {
      this.message.warning('Selecione a forma de pagamento.');
      return;
    }

    this.confirming = true;
    
    this.accountService.changePlan({
      subscriptionPlanId: this.selectedPlan.id,
      billingType: this.selectedBillingType,
    }).subscribe({
      next: () => {
        this.message.success('Plano alterado com sucesso!');
        this.modal.close(true);
      },
      error: () => {
        this.confirming = false;
      },
      complete: () => {
        this.confirming = false;
      }
    })
  }
}
