import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProposalService } from '../../../shared/services/proposal-service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Proposal } from '../../../core/models/proposal.interface';
import { PaginatedResult } from '../../../core/models/paginated-result.interface';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { BtnPesquisarComponent } from '../../../shared/components/btn-pesquisar/btn-pesquisar.component';
import { BtnLimparComponent } from '../../../shared/components/btn-limpar/btn-limpar.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { BtnNovoComponent } from '../../../shared/components/btn-novo/btn-novo.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { FormProposal } from '../form-proposal/form-proposal';
import { TagAtivo } from '../../../shared/components/tag-ativo-inativo/tag-ativo';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { ProposalView } from '../proposal-view/proposal-view';

@Component({
  standalone: true,
  selector: 'app-list-proposal',
  imports: [NzTableModule, NzButtonModule, NzIconModule, NzModalModule, NzTooltipModule, ReactiveFormsModule, NzFormModule, NzPaginationModule, BtnPesquisarComponent, BtnLimparComponent, NzInputModule, BtnNovoComponent,
    DatePipe, NzSelectModule, NgxMaskDirective, CurrencyPipe, TagAtivo, NzSwitchModule],
  templateUrl: './list-proposal.html',
  styleUrl: './list-proposal.css'
})
export class ListProposal implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    confirmModal?: NzModalRef;
    private modal = inject(NzModalService);
    private toastr = inject(ToastrService);
    constructor(private proposalService: ProposalService, private formBuilder: FormBuilder){
      this.filtroForm = this.formBuilder.group({
        titleFilter: [null],
        statusFilter: [''],
        documentFilter: [null],
        numberFilter: [null],
        onlyActive: [true]
      });

      this.filtroForm.get('documentFilter')?.valueChanges.subscribe(value => {
        this.onInputChange(value);
      });
    }
    filtroForm!: FormGroup;
    status = ['Draft', 'Sent', 'Approved', 'Rejected', 'Expired'];
    mask: string = '';

    checked = false;
    indeterminate = false;
    setOfCheckedId = new Set<string>();
    isLoadingUpdateTiers = false;
    paginatedProposals: PaginatedResult<Proposal> = <PaginatedResult<Proposal>>{};

    ngOnInit(): void {
      this.getProposals();
    }
  
    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
  
    getProposals(){
      var params = {
        pageIndex: this.paginatedProposals.pageIndex,
        pageSize: this.paginatedProposals.pageSize,
        title: this.filtroForm.get('titleFilter')?.value,
        proposalStatus: this.filtroForm.get('statusFilter')?.value,
        documentClient: this.filtroForm.get('documentFilter')?.value,
        number: this.filtroForm.get('numberFilter')?.value,
        onlyActive: this.filtroForm.get('onlyActive')?.value,
      };
      this.proposalService.getProposals(params)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            this.paginatedProposals = res;
          }
        })
    }

    openNewProposalModal(): void {
      const modal = this.modal.create({
        nzTitle: 'Cadastrar proposta',
        nzContent: FormProposal,
        nzWidth: '800px',
        nzFooter: null,
      });
  
      modal.afterClose.subscribe((result) => {
        if (result) {
          this.getProposals();
        }
      });
    }
  
    openEditProposalModal(proposalId: string): void {
      const modal = this.modal.create({
        nzTitle: 'Editar proposta',
        nzContent: FormProposal,
        nzWidth: '800px',
        nzData:{
          proposalId
        },
        nzFooter: null
      });
      
      modal.afterClose.subscribe((result) => {
        if (result) {
          this.getProposals();
        }
      });
    }

    openViewProposalModal(proposalId: string): void {
      this.modal.create({
        nzTitle: 'Detalhes da proposta',
        nzContent: ProposalView,
        nzWidth: '800px',
        nzData:{
          proposalId
        },
        nzFooter: null
      });
    }

    onPageChange(event: number){
      this.paginatedProposals.pageIndex = event;
      this.getProposals();
    }

    onPageSizeChange(event: number){
      this.paginatedProposals.pageSize = event;
      this.getProposals();
    }
  
    showConfirm(id: string): void {
      this.confirmModal = this.modal.confirm({
        nzTitle: 'Exclusão',
        nzContent: 'Tem certeza que quer <strong>DESATIVAR</strong> esta proposta?',
        nzOnOk: () =>
          this.proposalService.deleteProposal(id).subscribe({
            next: () => {
              this.toastr.success('Proposta desativada!', 'Sucesso');
              this.getProposals();
            }
          })
      });
    }

    sendProposal(id: string){
      this.proposalService.sendProposal(id).subscribe({
        next: () => {
          this.getProposals();
          this.toastr.success('Proposta enviada', 'Sucesso!');
        }
      })
    }

    limpar(){
      this.filtroForm.reset({
        onlyActive: true,
        statusFilter: ''
      });
    }

    onInputChange(value: string): void {
      if (value && value.length <= 11) {
        this.mask = '000.000.000-009'; // CPF
      } else {
        this.mask = '00.000.000/0000-00'; // CNPJ
      }
    }
}
