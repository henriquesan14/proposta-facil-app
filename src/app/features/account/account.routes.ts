import { Route } from "@angular/router";
import { SubscriptionAccount } from "./subscription-account/subscription-account";
import { UpdatePassword } from "./update-password/update-password";

export const ACCOUNT_ROUTES: Route[] = [
  {path: 'subscription', component: SubscriptionAccount},
  {path: 'update-password', component: UpdatePassword}
];