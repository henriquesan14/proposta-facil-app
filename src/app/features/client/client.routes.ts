import { Route } from "@angular/router";
import { ListClient } from "./list-client/list-client";

export const CLIENT_ROUTES: Route[] = [
  {path: 'list', component: ListClient},
];