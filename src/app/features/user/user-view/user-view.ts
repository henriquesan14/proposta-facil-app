import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../../core/models/user.interface';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../shared/services/user.service';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { TagAtivo } from '../../../shared/components/tag-ativo-inativo/tag-ativo';
import { PhonePipe } from '../../../shared/pipes/phone-pipe.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-view',
  imports: [NzDescriptionsModule, TagAtivo, PhonePipe, DatePipe],
  templateUrl: './user-view.html',
  styleUrl: './user-view.css'
})
export class UserView implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  user!: User;

  constructor(
    private userService: UserService,
    @Inject(NZ_MODAL_DATA) public data: { userId: string }
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUser(): void {
    this.userService.getUserById(this.data.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => this.user = data
      });
  }
}
