import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ClientService } from '../../../shared/services/client.service';
import { Client } from '../../../core/models/client.interface';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { CpfCnpjPipe } from '../../../shared/pipes/cpf-cnpj.pipe';
import { DatePipe } from '@angular/common';
import { TagAtivo } from '../../../shared/components/tag-ativo-inativo/tag-ativo';
import { PhonePipe } from '../../../shared/pipes/phone-pipe.pipe';

@Component({
  selector: 'app-client-view',
  imports: [NzDescriptionsModule, CpfCnpjPipe, DatePipe, TagAtivo, PhonePipe],
  templateUrl: './client-view.html',
  styleUrl: './client-view.css'
})
export class ClientView implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  client!: Client;

  constructor(
    private clientService: ClientService,
    @Inject(NZ_MODAL_DATA) public data: { clientId: string }
  ) { }

  ngOnInit(): void {
    this.loadClient();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadClient(): void {
    this.clientService.getClientById(this.data.clientId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => this.client = data
      });
  }
}
