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
import { PhonePipe } from '../../../shared/pipes/phone-pipe.pipe';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { UserView } from '../user-view/user-view';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { TagAtivo } from '../../../shared/components/tag-ativo-inativo/tag-ativo';

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [NzTableModule, NzButtonModule, NzIconModule, NzModalModule, NzTooltipModule, ReactiveFormsModule, NzFormModule, NzPaginationModule, BtnPesquisarComponent, BtnLimparComponent, NzInputModule, BtnNovoComponent,
    PhonePipe, NzSelectModule, NzSwitchModule, TagAtivo
  ],
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
        nameFilter: [null],
        role: [''],
        onlyActive: [true]
      });
    }
    filtroForm!: FormGroup;
    roles = ['AdminTenant', 'Sales', 'Viewer'];

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
        pageIndex: this.paginatedUsers.pageIndex,
        pageSize: this.paginatedUsers.pageSize,
        name: this.filtroForm.get('nameFilter')?.value,
        role: this.filtroForm.get('role')?.value,
        onlyActive: this.filtroForm.get('onlyActive')?.value
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

    openNewUserModal(): void {
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
  
    openEditUserModal(userId: string): void {
      const modal = this.modal.create({
        nzTitle: 'Editar usuário',
        nzContent: FormUserComponent,
        nzWidth: '800px',
        nzData:{
          userId
        },
        nzFooter: null
      });
      
      modal.afterClose.subscribe((result) => {
        if (result) {
          this.getUsers();
        }
      });
    }

    openViewUserModal(userId: string): void {
      this.modal.create({
        nzTitle: 'Detalhes do usuário',
        nzContent: UserView,
        nzWidth: '800px',
        nzData:{
          userId
        },
        nzFooter: null
      });
      
    }

    onPageChange(event: number){
      this.paginatedUsers.pageIndex = event;
      this.getUsers();
    }

    onPageSizeChange(event: number){
      this.paginatedUsers.pageSize = event;
      this.getUsers();
    }
  
    showConfirm(id: string): void {
      this.confirmModal = this.modal.confirm({
        nzTitle: 'Exclusão',
        nzContent: 'Tem certeza que quer <strong>DESATIVAR</strong> este usuário?',
        nzOnOk: () =>
          this.userService.deleteUser(id).subscribe({
            next: () => {
              this.toastr.success('Usuário desativado!', 'Sucesso');
              this.getUsers();
            }
          })
      });
    }

    limpar(){
      this.filtroForm.reset({
        onlyActive: true
      });
      this.filtroForm.get('role')?.setValue('');
    }
}
