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

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule, RouterModule, NzDropdownMenuComponent, NzDropDownModule,
    NzSpinModule, NzTooltipModule, HasRoleDirective
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  isCollapsed = false;
  private router = inject(Router);
  private localStorageService = inject(LocalstorageService);
  private authService = inject(AuthService);

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

  goToProfile() {
    this.router.navigateByUrl('/account/update-password');
  }
  
  logout() {
    this.isLoggingOut = true;
    this.authService.logout().subscribe({
      next: () => {
        this.localStorageService.removeUsertorage();
        this.router.navigateByUrl('/login');
        this.isLoggingOut = false;
      }
    })
  }

  subscriptionAccount(){
    console.log('foi')
    this.router.navigateByUrl('/account/subscription');
  }

  get nomeUsuario(){
    const response = this.localStorageService.getUserStorage();
    return response?.name;
  }

  get avatar(){
    return '/images/avatar.jpeg';
  }
}
