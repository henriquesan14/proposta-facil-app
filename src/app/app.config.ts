import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideNzI18n, pt_BR } from 'ng-zorro-antd/i18n';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import pt from '@angular/common/locales/pt';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { BulbOutline, CloseCircleOutline, CloseOutline, DeleteOutline, DollarOutline, EyeInvisibleOutline, EyeOutline, FileDoneOutline, HomeOutline, LockOutline, LogoutOutline, MenuFoldOutline, MenuUnfoldOutline, PauseCircleOutline, PlusCircleOutline, SearchOutline, SendOutline, SettingOutline, UsergroupAddOutline, UserOutline } from '@ant-design/icons-angular/icons';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { CredentialsInterceptor } from './core/interceptors/credentials.interceptor';
import { AccessTokenInterceptor } from './core/interceptors/access-token.interceptor';
import { ErrorHandlerInterceptor } from './core/interceptors/error-handle.interceptor';
import { provideNgxMask } from 'ngx-mask';

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
    provideNgxMask(),
    provideNzIcons([UserOutline, LockOutline, MenuFoldOutline, MenuUnfoldOutline, SettingOutline, LogoutOutline, CloseOutline, SearchOutline, PlusCircleOutline, UsergroupAddOutline, FileDoneOutline, CloseCircleOutline, 
      DeleteOutline, SendOutline, LockOutline, HomeOutline, EyeOutline, DollarOutline, BulbOutline, PauseCircleOutline, EyeInvisibleOutline]),
    provideAnimationsAsync(),
    provideToastr(),
  ]
};

