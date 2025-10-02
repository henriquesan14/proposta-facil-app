import { Route } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { ActivateAccount } from "./activate-account/activate-account";

export const AUTH_ROUTES: Route[] = [
  {path: 'login', component: LoginComponent},
  {path: 'activate-account', component: ActivateAccount}
];