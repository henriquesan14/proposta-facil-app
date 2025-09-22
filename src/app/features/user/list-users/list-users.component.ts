import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../shared/services/user.service';
import { User } from '../../../core/models/user.interface';
import { ToastrService } from 'ngx-toastr';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { FormUserComponent } from '../form-user/form-user.component';
import { PaginatedResult } from '../../../core/models/paginated-result.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { BtnPesquisarComponent } from '../../../shared/components/btn-pesquisar/btn-pesquisar.component';
import { BtnLimparComponent } from '../../../shared/components/btn-limpar/btn-limpar.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { BtnNovoComponent } from '../../../shared/components/btn-novo/btn-novo.component';

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [NzTableModule, NzButtonModule, NzIconModule, NzModalModule, NzTooltipModule, ReactiveFormsModule, NzFormModule, NzPaginationModule, BtnPesquisarComponent, BtnLimparComponent, NzInputModule, BtnNovoComponent],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.css'
})
export class ListUsersComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    confirmModal?: NzModalRef;
    private modal = inject(NzModalService);
    private toastr = inject(ToastrService);
    constructor(private userService: UserService, private formBuilder: FormBuilder){
      this.filtroForm = this.formBuilder.group({
        name: [null]
      });
    }
    filtroForm!: FormGroup;

    checked = false;
    indeterminate = false;
    setOfCheckedId = new Set<string>();
    isLoadingUpdateTiers = false;
    paginatedUsers: PaginatedResult<User> = <PaginatedResult<User>>{};
    isLoading = false;

    ngOnInit(): void {
      this.getUsers();
    }
  
    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
  
    getUsers(){
      var params = {
        pageNumber: this.paginatedUsers.pageNumber,
        pageSize: this.paginatedUsers.pageSize,
        ...this.filtroForm.value
      };
      this.isLoading = true;
      this.userService.getUsers(params)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            this.paginatedUsers = res;
          },
          error: () => {
            this.isLoading = false;
          },
          complete: () => {
            this.isLoading = false;
          }
        })
    }
  
  
    updateCheckedSet(id: string, checked: boolean): void {
      if (checked) {
        this.setOfCheckedId.add(id);
      } else {
        this.setOfCheckedId.delete(id);
      }
    }
  
    refreshCheckedStatus(): void {
      const listOfEnabledData = this.paginatedUsers.data.filter(({ disabled }) => !disabled);
      this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
      this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
    }
  
    onItemChecked(id: string, checked: boolean): void {
      this.updateCheckedSet(id, checked);
      this.refreshCheckedStatus();
    }
  
    onAllChecked(checked: boolean): void {
      this.paginatedUsers.data
        .filter(({ disabled }) => !disabled)
        .forEach(({ id }) => this.updateCheckedSet(id, checked));
      this.refreshCheckedStatus();
    }
  
    openNewPlayerModal(): void {
      const modal = this.modal.create({
        nzTitle: 'Cadastrar usuário',
        nzContent: FormUserComponent,
        nzWidth: '800px',
        nzFooter: null,
      });
  
      modal.afterClose.subscribe((result) => {
        if (result) {
          this.getUsers();
        }
      });
    }
  
    openEditPlayerModal(user: User): void {
      const modal = this.modal.create({
        nzTitle: 'Editar usuário',
        nzContent: FormUserComponent,
        nzWidth: '800px',
        nzData:{
          userToEdit: user
        },
        nzFooter: null
      });
      
      modal.afterClose.subscribe((result) => {
        if (result) {
          this.getUsers();
        }
      });
    }

    onPageChange(event: number){
      this.paginatedUsers.pageNumber = event;
      this.getUsers();
    }

    onPageSizeChange(event: number){
      this.paginatedUsers.pageSize = event;
      this.getUsers();
    }
  
    showConfirm(id: string): void {
      this.confirmModal = this.modal.confirm({
        nzTitle: 'Exclusão',
        nzContent: 'Tem certeza que quer remover este usuário?',
        nzOnOk: () =>
          this.userService.deleteUser(id).subscribe({
            next: () => {
              this.toastr.success('Usuário removido!', 'Sucesso');
              this.getUsers();
            }
          })
      });
    }
  
    showConfirmDeleteBatch(): void {
      this.confirmModal = this.modal.confirm({
        nzTitle: 'Exclusão',
        nzContent: 'Tem certeza que quer remover os usuários selecionados?',
        nzOnOk: () =>
         this.deletarPlayersBatch()
      });
    }
  
    deletarPlayersBatch() {
      const userIds = this.paginatedUsers.data.filter(data => this.setOfCheckedId.has(data.id)).map(p => p.id);
      this.userService.deleteUsersBatch(userIds).subscribe({
        next: () => {
          this.toastr.success('Usuários removidos!', 'Sucesso');
          this.getUsers();
        }
      });
    }

    limpar(){
      this.filtroForm.reset();
    }
}
