import { Route } from "@angular/router";
import { SubscriptionAccount } from "./subscription-account/subscription-account";

export const ACCOUNT_ROUTES: Route[] = [
  {path: 'subscription', component: SubscriptionAccount}
];