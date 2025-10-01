import { Route } from "@angular/router";
import { ListSubscriptionPlan } from "./list-subscription-plan/list-subscription-plan";

export const SUBSCRIPTION_PLAN_ROUTES: Route[] = [
  {path: 'list', component: ListSubscriptionPlan},
];