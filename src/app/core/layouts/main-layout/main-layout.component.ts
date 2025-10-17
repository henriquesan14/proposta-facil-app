import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropdownMenuComponent, NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { AuthService } from '../../../shared/services/auth.service';
import { LocalstorageService } from '../../../shared/services/local-storage.service';
import { Menu } from '../../models/menu.interface';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { HasRoleDirective } from '../../../shared/directives/has-role.directive';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { AdminService } from '../../../shared/services/admin.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule, RouterModule, NzDropdownMenuComponent, NzDropDownModule,
    NzSpinModule, NzTooltipModule, HasRoleDirective, NzTagModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  isCollapsed = false;
  private router = inject(Router);
  private localStorageService = inject(LocalstorageService);
  private authService = inject(AuthService);
  private adminService = inject(AdminService);
  private message = inject(NzMessageService);

  isLoggingOut = false;

  menuItems: Menu[] = [
    {
      title: 'Tenants',
      icon: 'home',
      role: 'AdminSystem',
      route: 'tenants/list'
    },
    {
      title: 'Assinaturas',
      icon: 'dollar',
      role: 'AdminSystem',
      route: 'subscriptions/list'
    },
    {
      title: 'Planos',
      icon: 'bulb',
      role: 'AdminSystem',
      route: 'subscription-plans/list'
    },
    {
      title: 'Usuários',
      icon: 'user',
      role: 'AdminTenant',
      route: 'users/list'
    },
    {
      title: 'Clientes',
      icon: 'usergroup-add',
      role: 'AdminTenant',
      route: 'clients/list'
    },
    {
      title: 'Propostas',
      icon: 'file-done',
      role: 'AdminTenant',
      route: 'proposals/list'
    }
  ]

  updatePassword() {
    this.router.navigateByUrl('account/update-password');
  }
  
  logout() {
    this.isLoggingOut = true;
    this.authService.logout().subscribe({
      next: () => {
        this.localStorageService.removeUserStorage();
        this.router.navigateByUrl('/login');
        this.isLoggingOut = false;
      }
    })
  }

  subscriptionAccount(){
    this.router.navigateByUrl('/account/subscription');
  }

  stopImpersonate(){
    this.adminService.stopImpersonateTenant().subscribe({
      next: (res) => {
        this.message.success('Você saiu do modo de impersonate');
        this.localStorageService.setUserStorage(res);
        this.router.navigate(['/tenants/list']);
      }
    })
  }

  get nomeUsuario(){
    const response = this.localStorageService.getUserStorage();
    return response?.name;
  }

  get avatar(){
    return '/images/avatar.jpeg';
  }

  get tenant(){
    const response = this.localStorageService.getUserStorage();
    return `${response?.tenantImpersonate?.name}`;
  }

  get isImpersonating() {
    return this.localStorageService.isImpersonate();
  }
}
