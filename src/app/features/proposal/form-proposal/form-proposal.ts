import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProposalService } from '../../../shared/services/proposal-service';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { CreateProposal } from '../../../core/models/create-proposal.interface';
import { FormUtils } from '../../../shared/utils/form.utils';
import { NgxMaskDirective } from 'ngx-mask';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { SelectAutocompleteComponent } from '../../../shared/components/select-autocomplete/select-autocomplete.component';
import { Client } from '../../../core/models/client.interface';
import { ClientService } from '../../../shared/services/client.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { CurrencyPipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-form-proposal',
  imports: [ReactiveFormsModule, NgxMaskDirective, NzButtonModule, NgxSpinnerModule, NzFormModule, NzInputModule, NzSelectModule, NzDatePickerModule, NzDatePickerModule,
    SelectAutocompleteComponent, NzCardModule, NzIconModule, NzTooltipModule, CurrencyPipe
  ],
  templateUrl: './form-proposal.html',
  styleUrl: './form-proposal.css'
})
export class FormProposal implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  formProposal!: FormGroup;
  clients: Client[] = [];

  constructor(private formBuilder: FormBuilder,
    private toastr: ToastrService, private spinnerService: NgxSpinnerService,
    private proposalService: ProposalService, private clientService: ClientService, private modalRef: NzModalRef, @Inject(NZ_MODAL_DATA) public data: { proposalId: string }) {
  }

  ngOnInit(): void {
    this.formProposal = this.formBuilder.group({
      clientId: [null, [Validators.required]],
      clientName: ['', [Validators.required]],
      title: [null, [Validators.required, Validators.maxLength(100)]],
      currency: ['BRL', [Validators.required]],
      validUntil: [null, Validators.required],
      items: this.formBuilder.array([this.createItem()])
    });
    this.getClients({ pageSize: 20 });
    if (this.data?.proposalId) {
      this.getClient();
    }

  }

  getClient() {
    this.proposalService.getProposalById(this.data.proposalId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.formProposal.patchValue({
            clientId: res.client.id,
            clientName: res.client.name,
            title: res.title,
            currency: res.currency,
            validUntil: new Date(res.validUntil)
          });

          const itemsFormArray = this.items;
          itemsFormArray.clear();

          if (res.items && res.items.length) {
            res.items.forEach((item: any) => {
              const itemGroup = this.createItem();
              itemGroup.patchValue({
                id: item.id,
                name: item.name,
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice
              });
              itemsFormArray.push(itemGroup);
            });
          } else {
            itemsFormArray.push(this.createItem());
          }
        }
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      name: ['', Validators.required],
      description: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.pattern(/^\d{1,3}$/)]], // 1 a 3 dígitos
      unitPrice: [null, Validators.required]
    });
  }

  addItem() {
    this.items.push(this.createItem());
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  getClients(params: any) {
    this.clientService.getClients(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.clients = res.data;
        }
      });
  }

  onChangeClient(event: any) {
    const name = typeof event === 'string' ? event : event?.target?.value || '';
    this.getClients({ name });
  }

  clientSelected(client: Client) {
    this.formProposal.patchValue({
      clientId: client.id,
      clientName: client.name
    });
  }

  clientDeselected() {
    this.formProposal.patchValue({
      clientId: null,
      clientName: null
    });
  }

  onSubmit() {
    if (this.formProposal.valid) {
      const form = this.formProposal.value;
      const proposal = <CreateProposal>{
        clientId: form.clientId,
        title: form.title,
        currency: form.currency,
        validUntil: form.validUntil.toISOString().split('T')[0],
        items: form.items,
      };


      if (this.data && this.data.proposalId) {
        this.updateCliente(proposal);
      } else {
        this.cadastrarProposal(proposal);
      }
    } else {
      FormUtils.markFormGroupTouched(this.formProposal);
    }
  }

  cadastrarProposal(proposal: CreateProposal) {
    this.spinnerService.show();
    this.proposalService.createProposal(proposal).subscribe({
      next: (res) => {
        this.toastr.success('Proposta cadastrada!', 'Sucesso!');
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

  updateCliente(proposal: CreateProposal) {
    this.spinnerService.show();
    proposal.id = this.data.proposalId;
    this.proposalService.updateProposal(proposal).subscribe({
      next: () => {
        this.toastr.success('Proposta atualizada!', 'Sucesso!');
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

  getMaskCpfCnpj() {
    return this.formProposal.get('tipoPessoa')?.value == 'PESSOA_FISICA' ? '000.000.000-00' : '00.000.000/0000-00';
  }

  get items(): FormArray {
    return this.formProposal.get('items') as FormArray;
  }

  get clientNameControl(): FormControl {
    return this.formProposal.get('clientName') as FormControl;
  }

  get totalProposal(): number {
    return this.items.controls.reduce((total, item) => {
      const quantity = item.get('quantity')?.value || 0;
      const unitPrice = item.get('unitPrice')?.value || 0;
      return total + quantity * unitPrice;
    }, 0);
  }
}
