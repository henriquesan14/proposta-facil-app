import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { SubscriptionPlanService } from '../../../shared/services/subscription-plan.service';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { SubscriptionPlan } from '../../../core/models/subscription-plan.interface';
import { FormUtils } from '../../../shared/utils/form.utils';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NgxMaskDirective } from 'ngx-mask';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-form-subscription-plan',
  imports: [ReactiveFormsModule, NzFormModule, NzInputModule, NgxMaskDirective, NgxSpinnerModule, NzButtonModule],
  templateUrl: './form-subscription-plan.html',
  styleUrl: './form-subscription-plan.css'
})
export class FormSubscriptionPlan implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  formSubscriptionPlan!: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private toastr: ToastrService, private spinnerService: NgxSpinnerService,
    private subscriptionPlanService: SubscriptionPlanService, private modalRef: NzModalRef,  @Inject(NZ_MODAL_DATA) public data: { subscriptionPlanId: string }) {
  }

  ngOnInit(): void {
    this.formSubscriptionPlan = this.formBuilder.group({
      name: [null, [Validators.required]],
      price: [null, [Validators.required]],
      maxProposalsPerMonth: [null, [Validators.required]],
      description: [null, Validators.required],
    });

    if (this.data?.subscriptionPlanId) {
      this.getSubscriptionPlan();
    }

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

    getSubscriptionPlan() {
    // this.subscriptionService.getProposalById(this.data.proposalId)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (res) => {
    //       this.formProposal.patchValue({
    //         clientId: res.client.id,
    //         clientName: res.client.name,
    //         title: res.title,
    //         currency: res.currency,
    //         validUntil: new Date(res.validUntil)
    //       });

    //       const itemsFormArray = this.items;
    //       itemsFormArray.clear();

    //       if (res.items && res.items.length) {
    //         res.items.forEach((item: any) => {
    //           const itemGroup = this.createItem();
    //           itemGroup.patchValue({
    //             id: item.id,
    //             name: item.name,
    //             description: item.description,
    //             quantity: item.quantity,
    //             unitPrice: item.unitPrice
    //           });
    //           itemsFormArray.push(itemGroup);
    //         });
    //       } else {
    //         itemsFormArray.push(this.createItem());
    //       }
    //     }
    //   })
  }

  onSubmit() {
    if (this.formSubscriptionPlan.valid) {
      const form = this.formSubscriptionPlan.value;
      const subscriptionPlan = <SubscriptionPlan>{
        name: form.name,
        price: form.price,
        maxProposalsPerMonth: form.maxProposalsPerMonth,
        description: form.description
      };

      if (this.data && this.data.subscriptionPlanId) {
        this.updateSubscriptionPlan(subscriptionPlan);
      } else {
        this.cadastrarSubscriptionPlan(subscriptionPlan);
      }
    } else {
      FormUtils.markFormGroupTouched(this.formSubscriptionPlan);
    }
  }

  cadastrarSubscriptionPlan(subscription: SubscriptionPlan) {
    this.spinnerService.show();
    this.subscriptionPlanService.createSubscriptionPlan(subscription).subscribe({
      next: (res) => {
        this.toastr.success('Plano cadastrado!', 'Sucesso!');
        this.modalRef.close(true);
      },
      error: () => {
        this.spinnerService.hide();
      },
      complete: () => {
        this.spinnerService.hide();
      }
    })
  }

  updateSubscriptionPlan(subscription: SubscriptionPlan) {
    this.spinnerService.show();
    subscription.id = this.data.subscriptionPlanId;
    this.subscriptionPlanService.updateSubscriptionPlan(subscription).subscribe({
      next: () => {
        this.toastr.success('Plano atualizado!', 'Sucesso!');
        this.modalRef.close(true);
      },
      error: () => {
        this.spinnerService.hide();
      },
      complete: () => {
        this.spinnerService.hide();
      }
    })
  }
}
