import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Proposal } from '../../../core/models/proposal.interface';
import { ProposalService } from '../../../shared/services/proposal-service';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { PhonePipe } from '../../../shared/pipes/phone-pipe.pipe';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-proposal-view',
  imports: [NzDescriptionsModule, NzCardModule, NzDividerModule, NzTableModule, CurrencyPipe, DatePipe, PhonePipe, NzTagModule],
  templateUrl: './proposal-view.html',
  styleUrl: './proposal-view.css'
})
export class ProposalView implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  proposal!: Proposal;

  constructor(
    private proposalService: ProposalService,
    @Inject(NZ_MODAL_DATA) public data: { proposalId: string }
  ) {}

  ngOnInit(): void {
    this.loadProposal();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProposal(): void {
    this.proposalService.getProposalById(this.data.proposalId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => this.proposal = data
      });
  }
}
