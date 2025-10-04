import { Route } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { ActivateAccount } from "./activate-account/activate-account";
import { ForgotPassword } from "./forgot-password/forgot-password";
import { ResetPassword } from "./reset-password/reset-password";

export const AUTH_ROUTES: Route[] = [
  {path: 'login', component: LoginComponent},
  {path: 'activate-account', component: ActivateAccount},
  {path: 'forgot-password', component: ForgotPassword},
  {path: 'reset-password', component: ResetPassword}
];