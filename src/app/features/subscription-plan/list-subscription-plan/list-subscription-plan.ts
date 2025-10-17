import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { SubscriptionPlanService } from '../../../shared/services/subscription-plan.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SubscriptionPlan } from '../../../core/models/subscription-plan.interface';
import { BtnNovoComponent } from '../../../shared/components/btn-novo/btn-novo.component';
import { BtnLimparComponent } from '../../../shared/components/btn-limpar/btn-limpar.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { BtnPesquisarComponent } from '../../../shared/components/btn-pesquisar/btn-pesquisar.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CurrencyPipe } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormSubscriptionPlan } from '../form-subscription-plan/form-subscription-plan';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { TagAtivo } from '../../../shared/components/tag-ativo-inativo/tag-ativo';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { SubscriptionPlanView } from '../subscription-plan-view/subscription-plan-view';

@Component({
  selector: 'app-list-subscription-plan',
  imports: [BtnNovoComponent, BtnLimparComponent, BtnPesquisarComponent,  ReactiveFormsModule, NzFormModule, NzTableModule, CurrencyPipe, NzButtonModule, NzIconModule, NzModalModule,
    NzInputModule, NzTooltipModule, TagAtivo, NzSwitchModule
  ],
  templateUrl: './list-subscription-plan.html',
  styleUrl: './list-subscription-plan.css'
})
export class ListSubscriptionPlan implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  confirmModal?: NzModalRef;
  private modal = inject(NzModalService);
  private toastr = inject(ToastrService);
  constructor(private subscriptionPlanService: SubscriptionPlanService, private formBuilder: FormBuilder) {
    this.filtroForm = this.formBuilder.group({
      nameFilter: [null],
      onlyActive: [true]
    });
  }
  filtroForm!: FormGroup;
  subscriptionPlans: SubscriptionPlan[] = [];

  ngOnInit(): void {
    this.getSubscriptionPlans();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getSubscriptionPlans(){
    const params = {
      name: this.filtroForm.get('nameFilter')?.value,
      onlyActive: this.filtroForm.get('onlyActive')?.value
    };
    this.subscriptionPlanService.getSubscriptionPlans(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.subscriptionPlans = res;
        }
      })
  }

  openNewSubscriptionPlanModal(): void {
    const modal = this.modal.create({
      nzTitle: 'Cadastrar plano de assinatura',
      nzContent: FormSubscriptionPlan,
      nzWidth: '800px',
      nzFooter: null,
    });

    modal.afterClose.subscribe((result) => {
      if (result) {
        this.getSubscriptionPlans();
      }
    });
  }

  openViewSubscriptionPlanModal(subscriptionPlanId: string): void {
      this.modal.create({
        nzTitle: 'Detalhes plano',
        nzContent: SubscriptionPlanView,
        nzWidth: '800px',
        nzData: {
          subscriptionPlanId
        },
        nzFooter: null,
      });
  }

  openEditSubscriptionModal(subscriptionPlan: SubscriptionPlan): void {
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

  showConfirm(subscriptionPlan: SubscriptionPlan): void {
      this.confirmModal = this.modal.confirm({
        nzTitle: 'Exclusão',
        nzContent: 'Tem certeza que quer <strong>DESATIVAR</strong> este plano?',
        nzOnOk: () =>
          this.subscriptionPlanService.deleteSubscriptionPlan(subscriptionPlan.id).subscribe({
            next: () => {
              this.toastr.success('Plano desativado!', 'Sucesso');
              this.getSubscriptionPlans();
            }
          })
      });
    }

  limpar() {
    this.filtroForm.reset({
      onlyActive: true
    });
  }
}
