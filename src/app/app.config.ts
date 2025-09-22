import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideNzI18n, pt_BR } from 'ng-zorro-antd/i18n';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import pt from '@angular/common/locales/pt';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { CloseOutline, LockOutline, LogoutOutline, MenuFoldOutline, PlusCircleOutline, SearchOutline, SettingOutline, UserOutline } from '@ant-design/icons-angular/icons';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { CredentialsInterceptor } from './core/interceptors/credentials.interceptor';
import { AccessTokenInterceptor } from './core/interceptors/access-token.interceptor';
import { ErrorHandlerInterceptor } from './core/interceptors/error-handle.interceptor';

registerLocaleData(pt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([CredentialsInterceptor, AccessTokenInterceptor, ErrorHandlerInterceptor])), 
    provideNzI18n(pt_BR), 
    provideHttpClient(), 
    provideNzI18n(pt_BR), 
    provideHttpClient(),
    provideNzIcons([UserOutline, LockOutline, MenuFoldOutline, SettingOutline, LogoutOutline, CloseOutline, SearchOutline, PlusCircleOutline]),
    provideAnimationsAsync(),
    provideToastr(),
  ]
};
