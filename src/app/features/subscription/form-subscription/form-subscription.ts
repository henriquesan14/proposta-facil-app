import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Tenant } from '../../../core/models/tenant.interface';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { SubscriptionService } from '../../../shared/services/subscription.service';
import { TenantService } from '../../../shared/services/tenant.service';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { SubscriptionPlanService } from '../../../shared/services/subscription-plan.service';
import { SubscriptionPlan } from '../../../core/models/subscription-plan.interface';
import { CreateSubscription } from '../../../core/models/create-subscription.interface';
import { FormUtils } from '../../../shared/utils/form.utils';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { SelectAutocompleteComponent } from '../../../shared/components/select-autocomplete/select-autocomplete.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-form-subscription',
  imports: [ReactiveFormsModule, NzButtonModule, NgxSpinnerModule, NzFormModule, NzInputModule, NzSelectModule,
    SelectAutocompleteComponent, NzIconModule, NzTooltipModule
  ],
  templateUrl: './form-subscription.html',
  styleUrl: './form-subscription.css',
  providers: [CurrencyPipe]
})
export class FormSubscription implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  formSubscription!: FormGroup;
  tenants: Tenant[] = [];
  subscriptionPlans: SubscriptionPlan[] = [];
  billingTypes = ['PIX', 'BOLETO', 'CREDIT_CARD'];

  constructor(private formBuilder: FormBuilder,
    private toastr: ToastrService, private spinnerService: NgxSpinnerService,
    private subscriptionService: SubscriptionService, private tenantService: TenantService, private subscriptionPlanService: SubscriptionPlanService,
     private modalRef: NzModalRef, private currencyPipe: CurrencyPipe, @Inject(NZ_MODAL_DATA) public data: { subscriptionId: string }) {
  }

  ngOnInit(): void {
    this.formSubscription = this.formBuilder.group({
      tenantId: [null, [Validators.required]],
      tenantName: ['', [Validators.required]],
      subscriptionPlanId: ['', [Validators.required]],
      billingType: ['', Validators.required],
    });
    this.getTenants({ pageSize: 20 });
    this.getSubscriptionPlans(null);
    if (this.data?.subscriptionId) {
      this.getSubscription();
    }

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getTenants(params: any) {
    this.tenantService.getTenants(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.tenants = res.data;
        }
      });
  }

  getSubscriptionPlans(params: any) {
    this.subscriptionPlanService.getSubscriptionPlans(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.subscriptionPlans = res;
        }
      });
  }

    getSubscription() {
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

  onChangeTenant(event: any) {
    const name = typeof event === 'string' ? event : event?.target?.value || '';
    this.getTenants({ name });
  }
  

  tenantSelected(tenant: Tenant) {
    this.formSubscription.patchValue({
      tenantId: tenant.id,
      tenantName: tenant.name
    });
  }

  tenantDeselected() {
    this.formSubscription.patchValue({
      tenantId: null,
      tenantName: null
    });
  }

  onSubmit() {
    console.log(this.formSubscription)
    if (this.formSubscription.valid) {
      const form = this.formSubscription.value;
      const proposal = <CreateSubscription>{
        tenantId: form.tenantId,
        subscriptionPlanId: form.subscriptionPlanId,
        billingType: form.billingType,
      };

      if (this.data && this.data.subscriptionId) {
        this.updateSubscription(proposal);
      } else {
        this.cadastrarSubscription(proposal);
      }
    } else {
      FormUtils.markFormGroupTouched(this.formSubscription);
    }
  }

  cadastrarSubscription(subscription: CreateSubscription) {
    this.spinnerService.show();
    this.subscriptionService.createSubscription(subscription).subscribe({
      next: (res) => {
        this.toastr.success('Assinatura cadastrada!', 'Sucesso!');
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

  updateSubscription(subscription: CreateSubscription) {
    this.spinnerService.show();
    subscription.id = this.data.subscriptionId;
    this.subscriptionService.updateSubscription(subscription).subscribe({
      next: () => {
        this.toastr.success('Assinatura atualizada!', 'Sucesso!');
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

  getNomePlan(name: string, price: number){
    var priceFormatted = this.currencyPipe.transform(price, 'BRL');

    return `${name} - ${priceFormatted}`;
  }

  get tenantNameControl(): FormControl {
    return this.formSubscription.get('tenantName') as FormControl;
  }
} 
