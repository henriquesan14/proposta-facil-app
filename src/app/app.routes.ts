import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { UnauthenticadedGuard } from './core/guards/unauthenticated.guard';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '', loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES) },
    ],
    canActivate: [UnauthenticadedGuard],
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'tenants', loadChildren: () => import('./features/tenant/tenant.routes').then(m => m.TENANT_ROUTES) },
      { path: 'subscriptions', loadChildren: () => import('./features/subscription/subscription.routes').then(m => m.SUBSCRIPTION_ROUTES) },
      { path: 'users', loadChildren: () => import('./features/user/user.routes').then(m => m.USER_ROUTES) },
      { path: 'clients', loadChildren: () => import('./features/client/client.routes').then(m => m.CLIENT_ROUTES) },
      { path: 'proposals', loadChildren: () => import('./features/proposal/proposal.routes').then(m => m.PROPOSAL_ROUTES) },
      { path: 'account', loadChildren: () => import('./features/account/account.routes').then(m => m.ACCOUNT_ROUTES) },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '/login'
  },

];
