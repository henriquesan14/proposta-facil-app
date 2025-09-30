import { Route } from "@angular/router";
import { ListSubscriptions } from "./list-subscriptions/list-subscriptions";

export const SUBSCRIPTION_ROUTES: Route[] = [
  {path: 'list', component: ListSubscriptions},
];