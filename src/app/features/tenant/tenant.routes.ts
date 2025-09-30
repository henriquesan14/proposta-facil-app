import { Route } from "@angular/router";
import { ListTenants } from "./list-tenants/list-tenants";

export const TENANT_ROUTES: Route[] = [
  {path: 'list', component: ListTenants},
];